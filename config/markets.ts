export const markets = {
  UK: {
    baseURL: "https://www.ploom.co.uk/en",
    shopURL: "https://www.ploom.co.uk/en/shop",
    language: "en",
    sku_example: "ploom-x-advanced",
  },
  PL: {
    baseURL: "https://www.ploom.pl/pl",
    shopURL: "https://www.ploom.pl/pl/sklep",
    language: "pl",
    sku_example: "16154414",
  },
};

export type Market = keyof typeof markets;

export const getMarketConfig = (market: Market) => markets[market];

export function isValidMarket(market): market is Market {
  return market === "UK" || market === "PL";
}
