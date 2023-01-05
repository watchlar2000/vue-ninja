const API_URL = "https://min-api.cryptocompare.com/data";
const API_KEY =
  "d594f9f2d553c6aa53ba9ac39aac53f6e7f8d9ade85ef0635560f57203915fe9";

const tickersHandlers = new Map();

const loadTickers = async () => {
  if (tickersHandlers.size === 0) return;
  const f = await fetch(
    `${API_URL}/pricemulti?fsyms=${[...tickersHandlers.keys()].join(
      ","
    )}&tsyms=USD&api_key=${API_KEY}`
  );
  const rawData = await f.json();
  const updatedPrices = Object.fromEntries(
    Object.entries(rawData).map(([ticker, price]) => [ticker, price.USD])
  );
  Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach((fn) => fn(newPrice));
  });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  // const subscribers = tickersHandlers.get(ticker) || [];
  // tickersHandlers.set(
  //   ticker,
  //   subscribers.filter((fn) => fn !== cb)
  // );
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;
