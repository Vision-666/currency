const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const transfers = [];

async function getLiveRates(base) {
  let primaryRates = {};
  let primaryUpdatedAt = "";
  let primaryError;
  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`);
    if (!response.ok) throw new Error(`Frankfurter returned HTTP ${response.status}.`);
    const data = await response.json();
    primaryRates = data.rates || {};
    primaryUpdatedAt = data.date || "";
  } catch (error) {
    primaryError = error;
  }

  let broaderRates = {};
  let broaderUpdatedAt = "";
  let broaderError;
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`);
    if (!response.ok) throw new Error(`ExchangeRate-API returned HTTP ${response.status}.`);
    const data = await response.json();
    if (data.result !== "success" || !data.rates) throw new Error("ExchangeRate-API returned an invalid response.");
    broaderRates = data.rates;
    broaderUpdatedAt = data.time_last_update_utc || "";
  } catch (error) {
    broaderError = error;
  }

  if (!Object.keys(primaryRates).length && !Object.keys(broaderRates).length) {
    throw new Error(`Live exchange rates are temporarily unavailable. ${primaryError?.message || broaderError?.message || ""}`.trim());
  }

  const fallbackCurrencies = Object.keys(broaderRates).filter(code => !Object.prototype.hasOwnProperty.call(primaryRates, code));
  return {
    rates: { [base]: 1, ...broaderRates, ...primaryRates },
    fallbackCurrencies,
    provider: Object.keys(primaryRates).length ? "Frankfurter with ExchangeRate-API fallback" : "ExchangeRate-API",
    updatedAt: primaryUpdatedAt || broaderUpdatedAt,
    broaderUpdatedAt,
    broaderUnavailable: Boolean(broaderError)
  };
}

async function getHistoricalRates(base, quote, range) {
  if (range === "6h" || range === "1d") {
    const symbol = `${base}${quote}=X`;
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=5m&range=5d`, {
      headers: { "User-Agent": "Mozilla/5.0 k4currency/1.0" }
    });
    if (!response.ok) return getCurrentRatePoint(base, quote);
    const data = await response.json();
    const result = data.chart?.result?.[0];
    const timestamps = result?.timestamp || [];
    const closes = result?.indicators?.quote?.[0]?.close || [];
    const points = timestamps
      .map((timestamp, index) => ({ date: new Date(timestamp * 1000).toISOString(), rate: closes[index] }))
      .filter(point => Number.isFinite(point.rate));
    return points.slice(-(range === "6h" ? 72 : 288));
  }
  const end = new Date();
  const start = new Date(end);
  const days = { "6h": 1, "1d": 1, "30d": 30, "1y": 365, "3y": 1095, "5y": 1825 }[range];
  if (days) start.setDate(start.getDate() - days);
  else start.setTime(Date.UTC(1999, 0, 1));
  const formatDate = date => date.toISOString().slice(0, 10);
  const response = await fetch(`https://api.frankfurter.app/${formatDate(start)}..${formatDate(end)}?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`);
  if (!response.ok) return getCurrentRatePoint(base, quote);
  const data = await response.json();
  const points = Object.entries(data.rates).map(([date, values]) => ({ date, rate: values[quote] })).filter(point => Number.isFinite(point.rate));
  return points.length ? points : getCurrentRatePoint(base, quote);
}

async function getCurrentRatePoint(base, quote) {
  const liveRates = await getLiveRates(base);
  const rate = liveRates.rates[quote];
  if (!Number.isFinite(rate)) throw new Error("No live rate is available for this currency pair.");
  return [{ date: new Date().toISOString(), rate }];
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 10_000) req.destroy();
    });
    req.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); } catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function serveFile(req, res) {
  const pathname = req.url.split("?")[0];
  const requested = pathname === "/" ? "/index.html" : pathname === "/world-clock" ? "/worldclock.html" : pathname === "/worldclock" ? "/worldclock.html" : pathname;
  const filePath = path.normalize(path.join(publicDir, requested));
  if (!filePath.startsWith(publicDir)) return sendJson(res, 403, { error: "Forbidden" });
  fs.readFile(filePath, (error, data) => {
    if (error) return sendJson(res, 404, { error: "Not found" });
    const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
    res.writeHead(200, { "Content-Type": `${types[path.extname(filePath)] || "text/plain"}; charset=utf-8` });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/api/rates") {
    const base = (url.searchParams.get("base") || "USD").toUpperCase();
    try {
      return sendJson(res, 200, { base, ...await getLiveRates(base), fetchedAt: new Date().toISOString() });
    } catch (error) {
      return sendJson(res, 502, { error: error.message });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/rates/history") {
    const base = (url.searchParams.get("base") || "USD").toUpperCase();
    const quote = (url.searchParams.get("quote") || "EUR").toUpperCase();
    const range = url.searchParams.get("range") || "30d";
    try {
      return sendJson(res, 200, { base, quote, range, points: await getHistoricalRates(base, quote, range) });
    } catch (error) {
      return sendJson(res, 502, { error: error.message });
    }
  }
  if (req.method === "POST" && url.pathname === "/api/transfers") {
    try {
      const data = await readBody(req);
      const amount = Number(data.amount);
      if (!data.recipient || !data.email || !data.from || !data.to || !Number.isFinite(amount) || amount <= 0) {
        return sendJson(res, 400, { error: "Please provide valid recipient, email, currencies, and amount." });
      }
      const liveRates = await getLiveRates(data.from);
      const rate = liveRates[data.to];
      if (!rate) return sendJson(res, 400, { error: "Currency pair is not supported." });
      const transfer = {
        id: `FP-${randomUUID().slice(0, 8).toUpperCase()}`,
        recipient: data.recipient,
        email: data.email,
        from: data.from,
        to: data.to,
        amount: Number(amount.toFixed(2)),
        received: Number((amount * rate).toFixed(2)),
        status: "Processing",
        createdAt: new Date().toISOString()
      };
      transfers.unshift(transfer);
      return sendJson(res, 201, transfer);
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/transfers") return sendJson(res, 200, transfers);
  if (req.method === "GET") return serveFile(req, res);
  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, () => console.log(`k4currency is running at http://localhost:${port}`));
