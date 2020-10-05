export const RATES_URL = 'https://api.exchangeratesapi.io/latest';

export interface Rates {
  [quote: string]: number;
}

export interface RatesResponse {
  base: string;
  rates: Rates;
  date?: string;
}

const getRatesUrl = (base: string) => `${RATES_URL}?base=${base}`;

const getRatesByBase = async (base: string): Promise<Rates> => {
  const url = getRatesUrl(base);
  const data = await fetch(url).then((res) => res.json());
  return data.rates;
};

const getRateByCurrencyPair = async (currencyPair: string): Promise<number> => {
  const base = currencyPair.substring(0, 3);
  const quote = currencyPair.substring(3);
  const rates = await getRatesByBase(base);
  return rates[quote];
};

export { getRatesByBase, getRateByCurrencyPair, getRatesUrl };
