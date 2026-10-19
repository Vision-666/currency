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
  ,{ country: "Argentina", code: "ARS" }
  ,{ country: "Bulgaria", code: "BGN" }
  ,{ country: "Chile", code: "CLP" }
  ,{ country: "Colombia", code: "COP" }
  ,{ country: "Egypt", code: "EGP" }
  ,{ country: "Iraq", code: "IQD" }
  ,{ country: "Jamaica", code: "JMD" }
  ,{ country: "Jordan", code: "JOD" }
  ,{ country: "Kenya", code: "KES" }
  ,{ country: "Kuwait", code: "KWD" }
  ,{ country: "Morocco", code: "MAD" }
  ,{ country: "Nigeria", code: "NGN" }
  ,{ country: "Oman", code: "OMR" }
  ,{ country: "Pakistan", code: "PKR" }
  ,{ country: "Peru", code: "PEN" }
  ,{ country: "Qatar", code: "QAR" }
  ,{ country: "Saudi Arabia", code: "SAR" }
  ,{ country: "United Arab Emirates", code: "AED" }
  ,{ country: "Uruguay", code: "UYU" }
  ,{ country: "Vietnam", code: "VND" }
  ,{ country: "Afghanistan", code: "AFN" }
  ,{ country: "Albania", code: "ALL" }
  ,{ country: "Algeria", code: "DZD" }
  ,{ country: "Armenia", code: "AMD" }
  ,{ country: "Aruba", code: "AWG" }
  ,{ country: "Azerbaijan", code: "AZN" }
  ,{ country: "Bahamas", code: "BSD" }
  ,{ country: "Bahrain", code: "BHD" }
  ,{ country: "Bangladesh", code: "BDT" }
  ,{ country: "Barbados", code: "BBD" }
  ,{ country: "Belarus", code: "BYN" }
  ,{ country: "Belize", code: "BZD" }
  ,{ country: "Bermuda", code: "BMD" }
  ,{ country: "Bhutan", code: "BTN" }
  ,{ country: "Bolivia", code: "BOB" }
  ,{ country: "Bosnia and Herzegovina", code: "BAM" }
  ,{ country: "Botswana", code: "BWP" }
  ,{ country: "Brunei", code: "BND" }
  ,{ country: "Burundi", code: "BIF" }
  ,{ country: "Cambodia", code: "KHR" }
  ,{ country: "Cape Verde", code: "CVE" }
  ,{ country: "Cayman Islands", code: "KYD" }
  ,{ country: "Central African CFA franc", code: "XAF" }
  ,{ country: "Comoros", code: "KMF" }
  ,{ country: "Costa Rica", code: "CRC" }
  ,{ country: "Croatia", code: "EUR" }
  ,{ country: "Cuba", code: "CUP" }
  ,{ country: "Curaçao", code: "ANG" }
  ,{ country: "Djibouti", code: "DJF" }
  ,{ country: "Dominican Republic", code: "DOP" }
  ,{ country: "East Caribbean", code: "XCD" }
  ,{ country: "Eritrea", code: "ERN" }
  ,{ country: "Eswatini", code: "SZL" }
  ,{ country: "Ethiopia", code: "ETB" }
  ,{ country: "Fiji", code: "FJD" }
  ,{ country: "Gambia", code: "GMD" }
  ,{ country: "Georgia", code: "GEL" }
  ,{ country: "Ghana", code: "GHS" }
  ,{ country: "Guatemala", code: "GTQ" }
  ,{ country: "Guinea", code: "GNF" }
  ,{ country: "Guyana", code: "GYD" }
  ,{ country: "Haiti", code: "HTG" }
  ,{ country: "Honduras", code: "HNL" }
  ,{ country: "Iran", code: "IRR" }
  ,{ country: "Jersey", code: "JEP" }
  ,{ country: "Kazakhstan", code: "KZT" }
  ,{ country: "Kyrgyzstan", code: "KGS" }
  ,{ country: "Laos", code: "LAK" }
  ,{ country: "Lebanon", code: "LBP" }
  ,{ country: "Lesotho", code: "LSL" }
  ,{ country: "Liberia", code: "LRD" }
  ,{ country: "Libya", code: "LYD" }
  ,{ country: "Macau", code: "MOP" }
  ,{ country: "Madagascar", code: "MGA" }
  ,{ country: "Malawi", code: "MWK" }
  ,{ country: "Maldives", code: "MVR" }
  ,{ country: "Mauritania", code: "MRU" }
  ,{ country: "Mauritius", code: "MUR" }
  ,{ country: "Moldova", code: "MDL" }
  ,{ country: "Mongolia", code: "MNT" }
  ,{ country: "Montenegro", code: "EUR" }
  ,{ country: "Mozambique", code: "MZN" }
  ,{ country: "Myanmar", code: "MMK" }
  ,{ country: "Namibia", code: "NAD" }
  ,{ country: "Nepal", code: "NPR" }
  ,{ country: "Nicaragua", code: "NIO" }
  ,{ country: "North Macedonia", code: "MKD" }
  ,{ country: "North Korea", code: "KPW" }
  ,{ country: "Panama", code: "PAB" }
  ,{ country: "Papua New Guinea", code: "PGK" }
  ,{ country: "Paraguay", code: "PYG" }
  ,{ country: "Rwanda", code: "RWF" }
  ,{ country: "Samoa", code: "WST" }
  ,{ country: "São Tomé and Príncipe", code: "STN" }
  ,{ country: "Serbia", code: "RSD" }
  ,{ country: "Seychelles", code: "SCR" }
  ,{ country: "Sierra Leone", code: "SLE" }
  ,{ country: "Solomon Islands", code: "SBD" }
  ,{ country: "Somalia", code: "SOS" }
  ,{ country: "Sri Lanka", code: "LKR" }
  ,{ country: "Sudan", code: "SDG" }
  ,{ country: "Suriname", code: "SRD" }
  ,{ country: "Syria", code: "SYP" }
  ,{ country: "Taiwan", code: "TWD" }
  ,{ country: "Tajikistan", code: "TJS" }
  ,{ country: "Tanzania", code: "TZS" }
  ,{ country: "Tonga", code: "TOP" }
  ,{ country: "Trinidad and Tobago", code: "TTD" }
  ,{ country: "Tunisia", code: "TND" }
  ,{ country: "Turkmenistan", code: "TMT" }
  ,{ country: "Uganda", code: "UGX" }
  ,{ country: "Ukraine", code: "UAH" }
  ,{ country: "Uzbekistan", code: "UZS" }
  ,{ country: "Vanuatu", code: "VUV" }
  ,{ country: "Venezuela", code: "VES" }
  ,{ country: "Yemen", code: "YER" }
  ,{ country: "Zambia", code: "ZMW" }
  ,{ country: "Zimbabwe", code: "ZWL" }
  ,{ country: "Bolivian Mvdol", code: "BOV" }
  ,{ country: "CFA franc BCEAO", code: "XOF" }
  ,{ country: "CFP franc", code: "XPF" }
  ,{ country: "Chilean unidad de fomento", code: "CLF" }
  ,{ country: "Colombian unidad de valor real", code: "COU" }
  ,{ country: "European unit of account (XBA)", code: "XBA" }
  ,{ country: "European unit of account (XBB)", code: "XBB" }
  ,{ country: "European unit of account (XBC)", code: "XBC" }
  ,{ country: "European unit of account (XBD)", code: "XBD" }
  ,{ country: "Gold", code: "XAU" }
  ,{ country: "International monetary fund", code: "XDR" }
  ,{ country: "Mexican unidad de inversión", code: "MXV" }
  ,{ country: "Platinum", code: "XPT" }
  ,{ country: "Palladium", code: "XPD" }
  ,{ country: "Sucre", code: "XSU" }
  ,{ country: "Testing currency code", code: "XTS" }
  ,{ country: "Uruguay peso en unidades indexadas", code: "UYI" }
  ,{ country: "Uruguay unidad previsional", code: "UYW" }
  ,{ country: "US dollar (next day)", code: "USN" }
  ,{ country: "ADB unit of account", code: "XUA" }
  ,{ country: "No currency", code: "XXX" }
].filter((currency, index, list) => list.findIndex(item => item.code === currency.code) === index);
currencies.sort((a, b) => a.country.localeCompare(b.country));
const countryCurrencies = {
  CA: "CAD", US: "USD", GB: "GBP", AU: "AUD",
  JP: "JPY", CN: "CNY", IN: "INR", CH: "CHF",
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR"
};
let rates = {};
let fallbackCurrencies = new Set();
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
  let typeahead = "";
  let typeaheadTimer;

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
  button.addEventListener("keydown", event => {
    if (event.key.length !== 1 || !/[a-z0-9]/i.test(event.key)) return;
    event.preventDefault();
    typeahead += event.key.toLowerCase();
    window.clearTimeout(typeaheadTimer);
    typeaheadTimer = window.setTimeout(() => { typeahead = ""; }, 700);
    const query = typeahead.toLowerCase();
    const match = currencies.find(({ code, country }) =>
      code.toLowerCase().startsWith(query) || country.toLowerCase().startsWith(query)
    );
    if (!match) return;
    select.value = match.code;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    updateButton();
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    const option = list.querySelector(`[data-value="${match.code}"]`);
    option?.scrollIntoView({ block: "nearest" });
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
  if (!Number.isFinite(rates[to])) return "";
  const result = Number(amount || 0) * rates[to];
  return result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateConverter() {
  const from = $("convertFrom").value;
  const to = $("convertTo").value;
  const supported = Number.isFinite(rates[to]);
  $("convertResult").value = supported ? convert($("convertAmount").value, from, to) : "Unavailable";
  $("rate").textContent = supported ? rates[to].toFixed(4) : "Unavailable";
  $("fromCode").textContent = from;
  $("toCode").textContent = to;
  $("chartRate").textContent = supported ? `${rates[to].toFixed(4)} ${to}` : "Live rate unavailable";
  if (!supported) {
    chartPoints = [];
    $("rateChart").innerHTML = "";
    $("chartStatus").textContent = "Live provider coverage is unavailable for this currency pair.";
  }
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
  const left = 34;
  const right = 4;
  const top = 10;
  const bottom = 30;
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
  chart.innerHTML = `<rect x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" class="chart-plot"></rect>${yMarkup}${xGridMarkup}<line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}" class="chart-axis"></line><line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" class="chart-axis"></line><polygon points="${areaPoints}" class="chart-area"></polygon><polyline points="${points}" fill="none" stroke="#5968dc" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></polyline><circle class="chart-current-point" cx="${left + plotWidth}" cy="${top + plotHeight - ((last.rate - min) / range) * plotHeight}" r="3.5" fill="#14231f"><title>${formatDate(last.date)}: ${formatRate(last.rate)}</title></circle><line class="chart-hover-line" x1="0" y1="${top}" x2="0" y2="${top + plotHeight}"></line><circle class="chart-hover-point" cx="0" cy="0" r="4"></circle><rect class="chart-hover-area" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" fill="transparent"></rect>${xMarkup}`;
  $("chartDetails").textContent = `${formatDate(chartPoints[0].date)}: ${formatRate(chartPoints[0].rate)} · Latest: ${formatDate(last.date)}: ${formatRate(last.rate)}`;
  $("chartTooltip").hidden = true;
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
  if (!response.ok) {
    if (fallbackCurrencies.has(quote)) {
      throw new Error("Historical chart unavailable for this fallback currency; the live conversion rate remains available.");
    }
    throw new Error(result.error || "Live chart unavailable");
  }
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
  if (result.points.length === 1 && fallbackCurrencies.has(quote)) {
    $("chartStatus").textContent = `Current live rate shown; historical data is unavailable for ${base}/${quote}.`;
  }
  renderChart();
}

async function loadRates(base) {
  rates = {};
  updateConverter();
  const response = await fetch(`/api/rates?base=${encodeURIComponent(base)}`);
  const result = await response.json();
  if (!response.ok) {
    $("chartStatus").textContent = result.error || "Live rates unavailable for this base currency.";
    throw new Error(result.error || "Live rates unavailable");
  }
  rates = { [base]: 1, ...result.rates };
  fallbackCurrencies = new Set(result.fallbackCurrencies || []);
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

init().catch(error => console.error(error));
