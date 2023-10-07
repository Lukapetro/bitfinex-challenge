export const formatTradingPair = (pair: string) => {
  const baseCurrency = pair.slice(1, 4);
  const quoteCurrency = pair.slice(4);
  return `${baseCurrency}/${quoteCurrency}`;
};
