const currencies = [
  { country: "Australia", code: "AUD" },
  { country: "Brazil", code: "BRL" },
  { country: "Canada", code: "CAD" },
  { country: "China", code: "CNY" },
  { country: "Czechia", code: "CZK" },
  { country: "Denmark", code: "DKK" },
  { country: "Eurozone", code: "EUR" },
  { country: "Hong Kong", code: "HKD" },
  { country: "Hungary", code: "HUF" },
  { country: "Iceland", code: "ISK" },
  { country: "India", code: "INR" },
  { country: "Indonesia", code: "IDR" },
  { country: "Israel", code: "ILS" },
  { country: "Japan", code: "JPY" },
  { country: "Malaysia", code: "MYR" },
  { country: "Mexico", code: "MXN" },
  { country: "New Zealand", code: "NZD" },
  { country: "Norway", code: "NOK" },
  { country: "Philippines", code: "PHP" },
  { country: "Poland", code: "PLN" },
  { country: "Romania", code: "RON" },
  { country: "Singapore", code: "SGD" },
  { country: "South Africa", code: "ZAR" },
  { country: "South Korea", code: "KRW" },
  { country: "Sweden", code: "SEK" },
  { country: "Switzerland", code: "CHF" },
  { country: "Thailand", code: "THB" },
  { country: "Türkiye", code: "TRY" },
  { country: "United Kingdom", code: "GBP" },
  { country: "United States", code: "USD" }
];
const countryCurrencies = {
  CA: "CAD", US: "USD", GB: "GBP", AU: "AUD",
  JP: "JPY", CN: "CNY", IN: "INR", CH: "CHF",
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR"
};
let rates = {};
let ratesUpdatedAt = "";
let chartPoints = [];
let selectedRange = "30d";
let chartPoll;
const $ = id => document.getElementById(id);
const track = (name, params = {}) => {
  if (typeof window.gtag === "function") window.gtag("event", name, params);
};
const currencySelects = [];

function closeCurrencySelects(target) {
  currencySelects.forEach(({ wrapper, list, button }) => {
    if (!target || !wrapper.contains(target)) {
      list.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("pointerdown", event => closeCurrencySelects(event.target));
document.addEventListener("click", event => closeCurrencySelects(event.target));
document.addEventListener("focusin", event => closeCurrencySelects(event.target));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCurrencySelects();
});

function fillSelect(select, selected) {
  select.innerHTML = currencies
    .map(({ country, code }) => `<option value="${code}" ${code === selected ? "selected" : ""}>${country} (${code})</option>`)
    .join("");

  const wrapper = document.createElement("div");
  wrapper.className = "currency-select";
  select.parentNode.insertBefore(wrapper, select);
  wrapper.append(select);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "currency-select-button";
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");
  wrapper.append(button);

  const list = document.createElement("div");
  list.className = "currency-select-list";
  list.setAttribute("role", "listbox");
  wrapper.append(list);

  const updateButton = () => {
    button.textContent = select.value;
    button.setAttribute("aria-label", `Selected currency: ${select.value}`);
    list.querySelectorAll("button").forEach(option => {
      option.setAttribute("aria-selected", String(option.dataset.value === select.value));
    });
  };

  currencies.forEach(({ country, code }) => {
    const option = document.createElement("button");
    option.type = "button";
    option.dataset.value = code;
    option.textContent = `${country} (${code})`;
    option.setAttribute("role", "option");
    option.addEventListener("click", () => {
      select.value = code;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      updateButton();
      list.hidden = true;
      button.setAttribute("aria-expanded", "false");
    });
    list.append(option);
  });

  button.addEventListener("click", () => {
    closeCurrencySelects(wrapper);
    list.hidden = !list.hidden;
    button.setAttribute("aria-expanded", String(!list.hidden));
  });
  currencySelects.push({ wrapper, list, button, select, updateButton });
  select.hidden = true;
  list.hidden = true;
  updateButton();
}

function getDefaultCurrency() {
  const country = new Intl.Locale(navigator.language).region;
  return countryCurrencies[country] || "CAD";
}

function convert(amount, from, to) {
  const result = Number(amount || 0) * (rates[to] || 0);
  return result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateConverter() {
  const from = $("convertFrom").value;
  const to = $("convertTo").value;
  $("convertResult").value = convert($("convertAmount").value, from, to);
  $("rate").textContent = (rates[to] || 0).toFixed(4);
  $("fromCode").textContent = from;
  $("toCode").textContent = to;
  $("chartRate").textContent = rates[to] ? `${rates[to].toFixed(4)} ${to}` : "Loading…";
  renderChart();
  track("converter_updated", { from_currency: from, to_currency: to });
}

function renderChart() {
  const chart = $("rateChart");
  if (!chart || chartPoints.length === 0) return;
  const displayPoints = chartPoints.length === 1
    ? [{ date: new Date(new Date(chartPoints[0].date).getTime() - 60 * 60 * 1000).toISOString(), rate: chartPoints[0].rate }, chartPoints[0]]
    : chartPoints;
  const width = 480;
  const height = 200;
  const left = 52;
  const right = 8;
  const top = 10;
  const bottom = 45;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const values = displayPoints.map(point => point.rate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || max * 0.01 || 1;
  const points = displayPoints.map((point, index) => {
    const x = left + (index / (displayPoints.length - 1)) * plotWidth;
    const y = top + plotHeight - ((point.rate - min) / range) * plotHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const formatRate = value => value.toFixed(4);
  const formatDate = date => new Intl.DateTimeFormat(undefined, selectedRange === "6h" || selectedRange === "1d"
    ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : selectedRange === "30d"
    ? { month: "short", day: "numeric" }
    : { month: "short", year: "numeric" }).format(new Date(date));
  const gridSteps = 4;
  const yTicks = Array.from({ length: gridSteps + 1 }, (_, index) => min + (range * index) / gridSteps);
  const yMarkup = yTicks.map((value, index) => {
    const y = top + plotHeight - (index / gridSteps) * plotHeight;
    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="chart-grid" stroke="#cbd6cf" stroke-opacity=".8" stroke-width="1"></line><text x="${left - 6}" y="${y + 3}" class="chart-axis-label" text-anchor="end">${formatRate(value)}</text>`;
  }).join("");
  const xIndexes = Array.from({ length: gridSteps + 1 }, (_, index) => Math.round((displayPoints.length - 1) * index / gridSteps));
  const xMarkup = xIndexes.map(index => {
    const x = left + (index / (displayPoints.length - 1)) * plotWidth;
    return `<text x="${x}" y="${height - 20}" class="chart-axis-label" text-anchor="${index === 0 ? "start" : index === displayPoints.length - 1 ? "end" : "middle"}">${formatDate(displayPoints[index].date)}</text>`;
  }).join("");
  const xGridMarkup = xIndexes.map(index => {
    const x = left + (index / (displayPoints.length - 1)) * plotWidth;
    return `<line x1="${x}" y1="${top}" x2="${x}" y2="${top + plotHeight}" class="chart-grid-vertical" stroke="#cbd6cf" stroke-opacity=".8" stroke-width="1"></line>`;
  }).join("");
  const last = displayPoints[displayPoints.length - 1];
  const areaPoints = `${left},${top + plotHeight} ${points} ${left + plotWidth},${top + plotHeight}`;
  chart.innerHTML = `<text x="${left}" y="${top - 2}" class="chart-axis-title" text-anchor="start">Rate</text><rect x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" class="chart-plot"></rect>${yMarkup}${xGridMarkup}<line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}" class="chart-axis"></line><line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" class="chart-axis"></line><polygon points="${areaPoints}" class="chart-area"></polygon><polyline points="${points}" fill="none" stroke="#5968dc" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></polyline><circle class="chart-current-point" cx="${left + plotWidth}" cy="${top + plotHeight - ((last.rate - min) / range) * plotHeight}" r="3.5" fill="#14231f"><title>${formatDate(last.date)}: ${formatRate(last.rate)}</title></circle><line class="chart-hover-line" x1="0" y1="${top}" x2="0" y2="${top + plotHeight}"></line><circle class="chart-hover-point" cx="0" cy="0" r="4"></circle><rect class="chart-hover-area" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" fill="transparent"></rect>${xMarkup}<text x="${left + plotWidth / 2}" y="${height - 3}" class="chart-axis-title" text-anchor="middle">Date</text>`;
  $("chartDetails").textContent = `${formatDate(chartPoints[0].date)}: ${formatRate(chartPoints[0].rate)} · Latest: ${formatDate(last.date)}: ${formatRate(last.rate)}`;
  const hoverLine = chart.querySelector(".chart-hover-line");
  const hoverPoint = chart.querySelector(".chart-hover-point");
  const hoverArea = chart.querySelector(".chart-hover-area");
  const tooltip = $("chartTooltip");
  const showPoint = index => {
    const point = displayPoints[index];
    const x = left + (index / (displayPoints.length - 1)) * plotWidth;
    const y = top + plotHeight - ((point.rate - min) / range) * plotHeight;
    hoverLine.setAttribute("x1", x);
    hoverLine.setAttribute("x2", x);
    hoverPoint.setAttribute("cx", x);
    hoverPoint.setAttribute("cy", y);
    hoverLine.style.visibility = "visible";
    hoverPoint.style.visibility = "visible";
    tooltip.textContent = `${formatDate(point.date)} · ${formatRate(point.rate)} ${$("toCode").textContent} per ${$("fromCode").textContent}`;
    tooltip.hidden = false;
  };
  hoverArea.addEventListener("mousemove", event => {
    const bounds = hoverArea.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    showPoint(Math.round(ratio * (displayPoints.length - 1)));
  });
  hoverArea.addEventListener("mouseleave", () => {
    hoverLine.style.visibility = "hidden";
    hoverPoint.style.visibility = "hidden";
    tooltip.hidden = true;
  });
}

async function loadChart(base, quote) {
  const response = await fetch(`/api/rates/history?base=${encodeURIComponent(base)}&quote=${encodeURIComponent(quote)}&range=${selectedRange}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Live chart unavailable");
  const liveRate = rates[quote];
  const now = new Date().toISOString();
  if (selectedRange === "6h" || selectedRange === "1d") {
    chartPoints = result.points;
  } else {
    chartPoints = result.points;
    if (Number.isFinite(liveRate)) chartPoints.push({ date: now, rate: liveRate });
  }
  const rangeLabels = { "6h": "6-hour", "1d": "1-day", "30d": "30-day", "1y": "1-year", "3y": "3-year", "5y": "5-year", all: "All-time" };
  const rangeLabel = rangeLabels[selectedRange] || selectedRange;
  $("chartRangeLabel").textContent = `${base}/${quote} currency pair · ${rangeLabel}`;
  $("chartStatus").textContent = selectedRange === "6h" || selectedRange === "1d"
    ? `Live 5-minute rates · ${base}/${quote}`
    : `Live updates every minute · ${base}/${quote}`;
  renderChart();
}

async function loadRates(base) {
  const response = await fetch(`/api/rates?base=${encodeURIComponent(base)}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Live rates unavailable");
  rates = { [base]: 1, ...result.rates };
  ratesUpdatedAt = result.updatedAt;
  updateConverter();
  const quote = $("convertTo").value;
  try {
    await loadChart(base, quote);
  } catch (error) {
    $("chartStatus").textContent = error.message;
    console.error(error);
  }
}

async function init() {
  const defaultCurrency = getDefaultCurrency();
  const defaultTarget = defaultCurrency === "EUR" ? "USD" : "EUR";
  fillSelect($("convertFrom"), defaultCurrency);
  fillSelect($("convertTo"), defaultTarget);
  await loadRates(defaultCurrency);
}

["convertAmount", "convertTo"].forEach(id => {
  $(id).addEventListener("input", updateConverter);
  $(id).addEventListener("change", updateConverter);
});
document.querySelector("#convertTo").addEventListener("change", () => {
  loadChart($("convertFrom").value, $("convertTo").value).catch(error => {
    $("chartStatus").textContent = error.message;
    console.error(error);
  });
});
document.querySelectorAll(".chart-range").forEach(button => {
  button.addEventListener("click", () => {
    selectedRange = button.dataset.range;
    document.querySelectorAll(".chart-range").forEach(item => item.classList.toggle("active", item === button));
    loadChart($("convertFrom").value, $("convertTo").value).catch(error => {
      $("chartStatus").textContent = error.message;
      console.error(error);
    });
  });
});
["convertFrom"].forEach(id => {
  $(id).addEventListener("change", async event => {
    track("source_currency_changed", { currency: event.target.value });
    try {
      await loadRates(event.target.value);
    } catch (error) {
      console.error(error);
    }
  });
});
$("swap").addEventListener("click", () => {
  const old = $("convertFrom").value;
  $("convertFrom").value = $("convertTo").value;
  $("convertTo").value = old;
  currencySelects.forEach(({ select, updateButton }) => {
    if (select === $("convertFrom") || select === $("convertTo")) updateButton();
  });
  track("currency_swap", { from_currency: $("convertFrom").value, to_currency: $("convertTo").value });
  loadRates($("convertFrom").value).catch(error => console.error(error));
});
$("convertAmount").addEventListener("change", () => {
  track("amount_changed", { currency: $("convertFrom").value });
});
chartPoll = window.setInterval(() => {
  loadRates($("convertFrom").value).catch(error => console.error(error));
}, 60_000);
const stripePublishableKey = "pk_live_51URfb41WOyNGSfQZeUwiQHgANowWdB1AVXMovmVpeONJTRTt9FW6hMnPGX15VTecvBXDVbHbtBd5fw3KPkhMCwW800RBvcjqaU";
const supportModal = $("supportModal");
const openSupport = () => {
  supportModal.hidden = false;
  $("supportUs").setAttribute("aria-expanded", "true");
  $("closeSupport").focus();
  track("support_opened");
};
const closeSupport = () => {
  supportModal.hidden = true;
  $("supportUs").setAttribute("aria-expanded", "false");
};
$("supportUs").setAttribute("aria-expanded", "false");
$("supportUs").addEventListener("click", openSupport);
$("closeSupport").addEventListener("click", closeSupport);
supportModal.querySelector("[data-close-support]").addEventListener("click", closeSupport);
$("copyBtc").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("btcAddress").textContent);
    $("btcStatus").textContent = "Copied.";
  } catch (error) {
    $("btcStatus").textContent = "Copy failed. Select the address manually.";
    console.error(error);
  }
  track("btc_support_selected");
});
$("stripeSupport").addEventListener("click", () => {
  const stripeReady = typeof window.Stripe === "function" && stripePublishableKey.startsWith("pk_");
  if (!stripeReady) {
    $("stripeStatus").textContent = "Stripe could not be loaded. Please try again.";
    return;
  }
  window.open("https://buy.stripe.com/dRm9AM2923ju48FePE6sw00", "_blank", "noopener,noreferrer");
  $("stripeStatus").textContent = "Stripe checkout opened in a new tab.";
  track("stripe_support_selected");
});
document.querySelectorAll("details").forEach(item => {
  item.addEventListener("toggle", () => {
    if (item.open) track("faq_opened", { question: item.querySelector("summary")?.textContent.trim() });
  });
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !supportModal.hidden) closeSupport();
});
const clockLocations = [
  { name: "New York", zone: "America/New_York" },
  { name: "London", zone: "Europe/London" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Sydney", zone: "Australia/Sydney" },
  { name: "Toronto", zone: "America/Toronto" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "Singapore", zone: "Asia/Singapore" },
  { name: "Mumbai", zone: "Asia/Kolkata" },
  { name: "São Paulo", zone: "America/Sao_Paulo" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "Auckland", zone: "Pacific/Auckland" }
];
function initWorldClocks() {
  const selections = ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"];
  document.querySelectorAll("[data-clock-select]").forEach(select => {
    clockLocations.forEach(location => {
      const option = document.createElement("option");
      option.value = location.zone;
      option.textContent = location.name;
      select.append(option);
    });
    select.value = selections[Number(select.dataset.clockSelect)];
    select.addEventListener("change", updateWorldClocks);
  });
  function updateWorldClocks() {
    const now = new Date();
    document.querySelectorAll("[data-clock-select]").forEach(select => {
      const index = Number(select.dataset.clockSelect);
      const zone = select.value;
      const location = clockLocations.find(item => item.zone === zone);
      const time = new Intl.DateTimeFormat(undefined, { timeZone: zone, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
      const date = new Intl.DateTimeFormat(undefined, { timeZone: zone, weekday: "short", month: "short", day: "numeric" }).format(now);
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).formatToParts(now);
      const hour = Number(parts.find(part => part.type === "hour").value) % 12;
      const minute = Number(parts.find(part => part.type === "minute").value);
      const second = Number(parts.find(part => part.type === "second").value);
      const timeElement = $(`clockTime${index}`);
      timeElement.textContent = time;
      timeElement.dateTime = now.toISOString();
      $(`clockDate${index}`).textContent = `${date} · ${location.name}`;
      const face = select.closest(".clock-card").querySelector(".clock-face");
      face.querySelector(".clock-hour").style.transform = `rotate(${hour * 30 + minute * .5}deg)`;
      face.querySelector(".clock-minute").style.transform = `rotate(${minute * 6 + second * .1}deg)`;
      face.querySelector(".clock-second").style.transform = `rotate(${second * 6}deg)`;
    });
  }
  updateWorldClocks();
  window.setInterval(updateWorldClocks, 1000);
}
initWorldClocks();
function initGlobe() {
  const canvas = $("worldGlobe");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  let features = [];
  let rotation = -20;
  let tilt = 8;
  let zoom = 1;
  let dragging = false;
  let previousPoint;
  let angularVelocity = .008;
  let lastFrame = performance.now();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const bounds = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  };
  const project = (longitude, latitude, centerX, centerY, radius) => {
    const lon = (longitude + rotation) * Math.PI / 180;
    const lat = latitude * Math.PI / 180;
    const tiltRadians = tilt * Math.PI / 180;
    const x = Math.cos(lat) * Math.sin(lon);
    const y = Math.cos(tiltRadians) * Math.sin(lat) - Math.sin(tiltRadians) * Math.cos(lat) * Math.cos(lon);
    const visible = Math.cos(lat) * Math.cos(lon) > -0.04;
    return { x: centerX + radius * x, y: centerY - radius * y, visible };
  };
  const isInsideGlobe = event => {
    const bounds = canvas.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    const radius = Math.min(width * .37, height * .43) * zoom;
    const x = event.clientX - bounds.left - width * .5;
    const y = event.clientY - bounds.top - height * .48;
    return x * x + y * y <= radius * radius;
  };
  const drawPolygon = (coordinates, centerX, centerY, radius, fill) => {
    coordinates.forEach(ring => {
      let segment = [];
      const paintSegment = () => {
        if (segment.length < 3) {
          segment = [];
          return;
        }
        context.beginPath();
        context.moveTo(segment[0].x, segment[0].y);
        segment.slice(1).forEach(point => context.lineTo(point.x, point.y));
        context.closePath();
        context.fillStyle = fill;
        context.fill();
        context.strokeStyle = "rgba(197, 247, 216, .32)";
        context.lineWidth = .65;
        context.stroke();
        segment = [];
      };
      ring.forEach(([longitude, latitude]) => {
        const point = project(longitude, latitude, centerX, centerY, radius);
        if (point.visible) {
          segment.push(point);
        } else {
          paintSegment();
        }
      });
      paintSegment();
    });
  };
  const draw = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    const centerX = width * .5;
    const centerY = height * .48;
    const radius = Math.min(width * .37, height * .43) * zoom;
    const glow = context.createRadialGradient(centerX - radius * .35, centerY - radius * .45, radius * .05, centerX, centerY, radius * 1.25);
    glow.addColorStop(0, "#8290ff");
    glow.addColorStop(.6, "#5968dc");
    glow.addColorStop(1, "#26317e");
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fillStyle = glow;
    context.fill();
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = "rgba(197, 247, 216, .22)";
    context.lineWidth = .7;
    for (let longitude = -150; longitude <= 180; longitude += 30) {
      context.beginPath();
      let started = false;
      for (let latitude = -90; latitude <= 90; latitude += 4) {
        const point = project(longitude, latitude, centerX, centerY, radius);
        if (point.visible) {
          if (!started) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
          started = true;
        }
      }
      context.stroke();
    }
    for (let latitude = -60; latitude <= 60; latitude += 30) {
      context.beginPath();
      let started = false;
      for (let longitude = -180; longitude <= 180; longitude += 4) {
        const point = project(longitude, latitude, centerX, centerY, radius);
        if (point.visible) {
          if (!started) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
          started = true;
        }
      }
      context.stroke();
    }
    features.forEach(feature => {
      const geometries = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      geometries.forEach(polygon => drawPolygon(polygon, centerX, centerY, radius, "#c5f7d8"));
    });
    context.restore();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.strokeStyle = "rgba(197, 247, 216, .7)";
    context.lineWidth = 1.2;
    context.stroke();
  };
  const animate = timestamp => {
    const elapsed = Math.min(50, timestamp - lastFrame);
    lastFrame = timestamp;
    if (!dragging && !reducedMotion) {
      rotation += angularVelocity * elapsed;
      angularVelocity += (.008 - angularVelocity) * Math.min(1, elapsed / 1200);
      draw();
    }
    window.requestAnimationFrame(animate);
  };
  canvas.addEventListener("pointerdown", event => {
    if (!isInsideGlobe(event)) return;
    dragging = true;
    angularVelocity = 0;
    previousPoint = event;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    if (!dragging) return;
    const elapsed = Math.max(8, event.timeStamp - previousPoint.timeStamp);
    const horizontalDelta = event.clientX - previousPoint.clientX;
    rotation += horizontalDelta * .45;
    angularVelocity = Math.max(-.7, Math.min(.7, horizontalDelta * .45 / elapsed));
    tilt = Math.max(-55, Math.min(55, tilt - (event.clientY - previousPoint.clientY) * .3));
    previousPoint = event;
    draw();
  });
  canvas.addEventListener("pointerup", event => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => { dragging = false; });
  canvas.addEventListener("wheel", event => {
    if (!isInsideGlobe(event)) return;
    event.preventDefault();
    zoom = Math.max(.8, Math.min(1.2, zoom - event.deltaY * .001));
    draw();
  }, { passive: false });
  window.addEventListener("resize", resize);
  fetch("/assets/world-countries.json")
    .then(response => {
      if (!response.ok) throw new Error("Country boundary data unavailable.");
      return response.json();
    })
    .then(data => {
      features = data.features || [];
      resize();
    })
    .catch(error => {
      console.error(error);
      resize();
    });
  resize();
  window.requestAnimationFrame(animate);
}
initGlobe();
init().catch(error => console.error(error));
