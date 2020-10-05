const getRateDisplay = (rate: number, decimals = 2): string => {
  if (!rate || rate % 1 === 0) {
    return rate.toString();
  }

  const rateDisplay = rate.toFixed(decimals + 1);
  return rateDisplay.substring(0, rateDisplay.length - 1);
};

const calculateExchangeAmount = (
  amount: number,
  rate: number,
  fromBase = true
) => (fromBase ? amount * rate : amount / rate);

export { calculateExchangeAmount, getRateDisplay };
