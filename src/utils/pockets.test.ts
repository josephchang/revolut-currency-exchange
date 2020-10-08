import { Pocket } from '../types';
import { doesExceedBalance, updatePocketBalances } from './pockets';

describe('pockets', () => {
  describe('Given pockets of varying balances', () => {
    const pockets: Pocket[] = [
      {
        currency: 'GBP',
        balance: 89.22,
      },
      {
        currency: 'EUR',
        balance: 194.83,
      },
    ];

    it('should return true if the amount to be exchanged is more', () => {
      const currency = 'GBP';
      const exceedsBalance = doesExceedBalance(currency, pockets, 100);
      expect(exceedsBalance).toBe(true);
    });

    it('should return false if the amount to be exchanged is less', () => {
      const currency = 'EUR';
      const exceedsBalance = doesExceedBalance(currency, pockets, 100);
      expect(exceedsBalance).toBe(false);
    });

    it('should return false if the amount to be exchanged is the same', () => {
      const currency = pockets[0].currency;
      const exceedsBalance = doesExceedBalance(
        currency,
        pockets,
        pockets[0].balance
      );
      expect(exceedsBalance).toBe(false);
    });

    it('should return true if the currency does not exist in the pockets', () => {
      const currency = 'USD';
      const exceedsBalance = doesExceedBalance(currency, pockets, 100);
      expect(exceedsBalance).toBe(true);
    });

    it('should update the balances', () => {
      const pocketsCopy = [...pockets];
      const basePocket = pockets[0];
      const baseAmount = 12.34;
      const quotePocket = pockets[1];
      const quoteAmount = 14.56;
      const updatedPockets = updatePocketBalances(
        pocketsCopy,
        basePocket.currency,
        baseAmount,
        quotePocket.currency,
        quoteAmount
      );
      expect(updatedPockets[0].balance).toBe(basePocket.balance - baseAmount);
      expect(updatedPockets[1].balance).toBe(quotePocket.balance + quoteAmount);
    });
  });
});
