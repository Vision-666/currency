const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR", "CHF"];
const countryCurrencies = {
  CA: "CAD", US: "USD", GB: "GBP", AU: "AUD",
  JP: "JPY", CN: "CNY", IN: "INR", CH: "CHF",
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR"
};
let rates = {};
let ratesUpdatedAt = "";
const $ = id => document.getElementById(id);

function fillSelect(select, selected) {
  select.innerHTML = currencies.map(code => `<option ${code === selected ? "selected" : ""}>${code}</option>`).join("");
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
}

async function loadRates(base) {
  const response = await fetch(`/api/rates?base=${encodeURIComponent(base)}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Live rates unavailable");
  rates = { [base]: 1, ...result.rates };
  ratesUpdatedAt = result.updatedAt;
  updateConverter();
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
["convertFrom"].forEach(id => {
  $(id).addEventListener("change", async event => {
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
  loadRates($("convertFrom").value).catch(error => console.error(error));
});
init().catch(error => console.error(error));
