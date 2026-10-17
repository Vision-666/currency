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
const liveSamples = new Map();
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
  currencySelects.push({ wrapper, list, button });
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

function recordLiveSample(base, quote, rate, timestamp) {
  if (!Number.isFinite(rate)) return;
  const key = `${base}/${quote}`;
  const samples = liveSamples.get(key) || [];
  const next = samples.filter(point => Date.now() - new Date(point.date).getTime() <= 24 * 60 * 60 * 1000);
  const last = next[next.length - 1];
  if (!last || new Date(timestamp).getTime() - new Date(last.date).getTime() >= 30_000) {
    next.push({ date: timestamp, rate });
  }
  liveSamples.set(key, next);
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
  if (!chart || chartPoints.length < 2) return;
  const width = 480;
  const height = 200;
  const left = 52;
  const right = 8;
  const top = 10;
  const bottom = 45;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const values = chartPoints.map(point => point.rate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || max * 0.01 || 1;
  const points = chartPoints.map((point, index) => {
    const x = left + (index / (chartPoints.length - 1)) * plotWidth;
    const y = top + plotHeight - ((point.rate - min) / range) * plotHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const formatRate = value => value.toFixed(4);
  const formatDate = date => new Intl.DateTimeFormat(undefined, ["6h", "1d", "30d"].includes(selectedRange)
    ? { month: "short", day: "numeric" }
    : { month: "short", year: "numeric" }).format(new Date(date));
  const yTicks = [min, min + range / 2, max];
  const yMarkup = yTicks.map((value, index) => {
    const y = top + plotHeight - (index / 2) * plotHeight;
    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="chart-grid"></line><text x="${left - 6}" y="${y + 3}" class="chart-axis-label" text-anchor="end">${formatRate(value)}</text>`;
  }).join("");
  const xIndexes = [0, Math.floor((chartPoints.length - 1) / 2), chartPoints.length - 1];
  const xMarkup = xIndexes.map(index => {
    const x = left + (index / (chartPoints.length - 1)) * plotWidth;
    return `<text x="${x}" y="${height - 20}" class="chart-axis-label" text-anchor="${index === 0 ? "start" : index === chartPoints.length - 1 ? "end" : "middle"}">${formatDate(chartPoints[index].date)}</text>`;
  }).join("");
  const xGridMarkup = xIndexes.map(index => {
    const x = left + (index / (chartPoints.length - 1)) * plotWidth;
    return `<line x1="${x}" y1="${top}" x2="${x}" y2="${top + plotHeight}" class="chart-grid-vertical"></line>`;
  }).join("");
  const last = chartPoints[chartPoints.length - 1];
  const areaPoints = `${left},${top + plotHeight} ${points} ${left + plotWidth},${top + plotHeight}`;
  chart.innerHTML = `<defs><linearGradient id="horizontalGridFade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dfe6df" stop-opacity=".15"></stop><stop offset=".5" stop-color="#9eada5" stop-opacity=".5"></stop><stop offset="1" stop-color="#dfe6df" stop-opacity=".15"></stop></linearGradient><linearGradient id="verticalGridFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6df" stop-opacity=".15"></stop><stop offset=".5" stop-color="#9eada5" stop-opacity=".5"></stop><stop offset="1" stop-color="#dfe6df" stop-opacity=".15"></stop></linearGradient></defs><text x="14" y="${top + plotHeight / 2}" class="chart-axis-title" transform="rotate(-90 14 ${top + plotHeight / 2})">Rate</text><rect x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" class="chart-plot"></rect>${yMarkup}${xGridMarkup}<line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}" class="chart-axis"></line><line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" class="chart-axis"></line><polygon points="${areaPoints}" class="chart-area"></polygon><polyline points="${points}" fill="none" stroke="#5968dc" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></polyline><circle class="chart-current-point" cx="${left + plotWidth}" cy="${top + plotHeight - ((last.rate - min) / range) * plotHeight}" r="3.5" fill="#14231f"><title>${formatDate(last.date)}: ${formatRate(last.rate)}</title></circle><line class="chart-hover-line" x1="0" y1="${top}" x2="0" y2="${top + plotHeight}"></line><circle class="chart-hover-point" cx="0" cy="0" r="4"></circle><rect class="chart-hover-area" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" fill="transparent"></rect>${xMarkup}<text x="${left + plotWidth / 2}" y="${height - 3}" class="chart-axis-title" text-anchor="middle">Date</text>`;
  $("chartDetails").textContent = `${formatDate(chartPoints[0].date)}: ${formatRate(chartPoints[0].rate)} · Latest: ${formatDate(last.date)}: ${formatRate(last.rate)}`;
  const hoverLine = chart.querySelector(".chart-hover-line");
  const hoverPoint = chart.querySelector(".chart-hover-point");
  const hoverArea = chart.querySelector(".chart-hover-area");
  const tooltip = $("chartTooltip");
  const showPoint = index => {
    const point = chartPoints[index];
    const x = left + (index / (chartPoints.length - 1)) * plotWidth;
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
    showPoint(Math.round(ratio * (chartPoints.length - 1)));
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
  recordLiveSample(base, quote, liveRate, now);
  const samples = liveSamples.get(`${base}/${quote}`) || [];
  if (selectedRange === "6h") {
    const cutoff = Date.now() - 6 * 60 * 60 * 1000;
    chartPoints = samples.filter(point => new Date(point.date).getTime() >= cutoff);
  } else if (selectedRange === "1d") {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    chartPoints = [...result.points.filter(point => new Date(point.date).getTime() >= cutoff), ...samples.filter(point => new Date(point.date).getTime() >= cutoff)];
  } else {
    chartPoints = result.points;
    if (Number.isFinite(liveRate)) chartPoints.push({ date: now, rate: liveRate });
  }
  const rangeLabels = { "6h": "6-hour", "1d": "1-day", "30d": "30-day", "1y": "1-year", "3y": "3-year", "5y": "5-year", all: "All-time" };
  const rangeLabel = rangeLabels[selectedRange] || selectedRange;
  $("chartRangeLabel").textContent = `${base}/${quote} currency pair · ${rangeLabel}`;
  $("chartStatus").textContent = selectedRange === "6h" && chartPoints.length < 2
    ? `Collecting live samples every minute · ${base}/${quote}`
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
  track("currency_swap", { from_currency: $("convertFrom").value, to_currency: $("convertTo").value });
  loadRates($("convertFrom").value).catch(error => console.error(error));
});
$("convertAmount").addEventListener("change", () => {
  track("amount_changed", { currency: $("convertFrom").value });
});
chartPoll = window.setInterval(() => {
  loadRates($("convertFrom").value).catch(error => console.error(error));
}, 60_000);
document.querySelectorAll("details").forEach(item => {
  item.addEventListener("toggle", () => {
    if (item.open) track("faq_opened", { question: item.querySelector("summary")?.textContent.trim() });
  });
});
init().catch(error => console.error(error));
