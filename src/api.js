const API_BASE_URL = "https://min-api.cryptocompare.com";
const API_KEY =
  "39acd117e12a4166d8ec5eb74c62865953e5e60c241a66c9c8030140f7de9170";

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";
const INVALID_SUB_INDEX = "500";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL,
    PRICE,
    PARAMETER: parameter
  } = JSON.parse(e.data);

  if (type !== AGGREGATE_INDEX && type !== INVALID_SUB_INDEX) {
    return;
  }

  const currentTicker = {
    currency: FROMSYMBOL,
    newPrice: PRICE
  };

  if (type === INVALID_SUB_INDEX) {
    currentTicker.currency = parameter.split("~")[2];
    currentTicker.newPrice = "invalid";
  }

  const handlers = tickersHandlers.get(currentTicker.currency) ?? [];
  handlers.forEach((fn) => fn(currentTicker.newPrice));
});

const sendToWebSocket = (msg) => {
  const stringifiedMessage = JSON.stringify(msg);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener("open", () => socket.send(stringifiedMessage), {
    once: true
  });
};

const subscribeToTickerOnWs = (ticker, currency = "USD") => {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${currency}`]
  });
};

const unsubscribeFromTickerOnWs = (ticker, currency = "USD") => {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~${currency}`]
  });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  // const subscribers = tickersHandlers.get(ticker) || [];
  // tickersHandlers.set(
  //   ticker,
  //   subscribers.filter((fn) => fn !== cb)
  // );
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

export const getTickerTradingInfo = async (tickerName) => {
  const res = await fetch(
    `${API_BASE_URL}/data/generateAvg?fsym=${tickerName}&tsym=USD&e=Kraken&api_key=${API_KEY}`
  );
  const tradingInfo = await res.json();
  return tradingInfo.RAW;
};

export const getFullTickersList = async () => {
  const res = await fetch(`${API_BASE_URL}/data/all/coinlist?summary=true`);
  const { Data: fullTickersList } = await res.json();
  return Object.keys(fullTickersList);
};

window.tickers = tickersHandlers;
