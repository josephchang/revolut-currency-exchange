import fetchMock from 'fetch-mock-jest';
import {
  Rates,
  getRatesByBase,
  getRateByCurrencyPair,
  getRatesUrl,
} from './rates';
import { mockGBP } from './mocks';

describe('Given GBP as base currency', () => {
  const base = 'GBP';
  const fetchResponse = {
    base,
    rates: {
      ...mockGBP,
    },
  };

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.get(getRatesUrl(base), fetchResponse);
  });

  describe('When the rates are retrieved', () => {
    let rates: Rates;

    beforeEach(async () => {
      rates = await getRatesByBase(base);
    });

    it('should get the rates of base currency', () => {
      expect(rates).toStrictEqual(fetchResponse.rates);
    });
  });

  describe('And a quote currency of EUR', () => {
    const quote = 'EUR';

    describe('When the currency pair rate is retrieved', () => {
      let rate: number;

      beforeEach(async () => {
        rate = await getRateByCurrencyPair(`${base}${quote}`);
      });

      it('should get the rates of base currency', () => {
        expect(rate).toBe(fetchResponse.rates[quote]);
      });
    });
  });
});
