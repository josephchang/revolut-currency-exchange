import { SupportedCurrencies } from '../types';

type CurrencySymbols = {
  [currency: string]: string;
};

const currencySymbols: CurrencySymbols = {
  EUR: '€',
  GBP: '£',
  USD: '$',
};

const getCurrencySymbol = (currency: SupportedCurrencies) =>
  currencySymbols[currency];

export { getCurrencySymbol };
