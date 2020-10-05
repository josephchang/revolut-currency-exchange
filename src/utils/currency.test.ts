import { getCurrencySymbol } from './currency';

describe('currency', () => {
  it('should get currency symbol of GBP', () => {
    const currency = 'GBP';
    const currencySymbol = getCurrencySymbol(currency);
    expect(currencySymbol).toBe('£');
  });

  it('should get currency symbol of EUR', () => {
    const currency = 'EUR';
    const currencySymbol = getCurrencySymbol(currency);
    expect(currencySymbol).toBe('€');
  });

  it('should get currency symbol of USD', () => {
    const currency = 'USD';
    const currencySymbol = getCurrencySymbol(currency);
    expect(currencySymbol).toBe('$');
  });
});
