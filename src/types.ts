export type SupportedCurrencies = 'EUR' | 'GBP' | 'USD';

export interface Pocket {
  currency: SupportedCurrencies;
  balance: number;
}
