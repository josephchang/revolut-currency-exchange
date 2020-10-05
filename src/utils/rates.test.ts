import { calculateExchangeAmount, getRateDisplay } from './rates';

describe('rates', () => {
  describe('When getRateDisplay', () => {
    it('should display 123.45 for 123.456789', () => {
      const displayNumber = getRateDisplay(123.456789);
      expect(displayNumber).toBe('123.45');
    });

    it('should display 123.4567 for 123.456789', () => {
      const displayNumber = getRateDisplay(123.456789, 4);
      expect(displayNumber).toBe('123.4567');
    });

    it('should display 123 for 123', () => {
      const displayNumber = getRateDisplay(123, 4);
      expect(displayNumber).toBe('123');
    });
  });

  describe('When calculateExchangeAmount', () => {
    const amount = 100;
    const rate = 1.1;
    it('should calculate amount when base amount is passed', () => {
      const exchangedAmount = calculateExchangeAmount(amount, rate);
      expect(exchangedAmount).toBe(amount * rate);
    });

    it('should calculate amount when quote amount is passed', () => {
      const exchangedAmount = calculateExchangeAmount(amount, rate, false);
      expect(exchangedAmount).toBe(amount / rate);
    });
  });
});
