import React from 'react';
import { getByTestId, queryByTestId } from '@testing-library/dom';
import {
  cleanup,
  render,
  fireEvent,
  RenderResult,
} from '@testing-library/react';
import { getRateByCurrencyPair } from './data/rates';
import { mockGBP, mockEUR, mockUSD } from './data/mocks';
import { calculateExchangeAmount, getRateDisplay } from './utils/rates';
import App from './App';

jest.mock('./data/rates', () => ({
  getRateByCurrencyPair: jest.fn(),
}));

describe('Given the exchange screen', () => {
  let result: RenderResult;
  let baseContainer: HTMLElement;
  let quoteContainer: HTMLElement;
  let baseField: HTMLInputElement;
  let quoteField: HTMLInputElement;

  beforeEach(() => {
    jest.useFakeTimers();
    (getRateByCurrencyPair as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockGBP.EUR)
    );
    result = render(<App />);
    baseContainer = result.getByTestId('exchange-base');
    quoteContainer = result.getByTestId('exchange-quote');
    baseField = getByTestId(
      baseContainer,
      'exchange-base-amount'
    ) as HTMLInputElement;
    quoteField = getByTestId(
      quoteContainer,
      'exchange-quote-amount'
    ) as HTMLInputElement;
  });

  afterEach(() => {
    jest.clearAllTimers();
    cleanup();
  });

  it('should show the pockets for base currency', () => {
    expect(queryByTestId(baseContainer, 'pocketsListItem-GBP')).toBeTruthy();
    expect(queryByTestId(baseContainer, 'pocketsListItem-EUR')).toBeTruthy();
    expect(queryByTestId(baseContainer, 'pocketsListItem-USD')).toBeTruthy();
  });

  it('should show the pockets for quote currency', () => {
    expect(queryByTestId(quoteContainer, 'pocketsListItem-GBP')).toBeTruthy();
    expect(queryByTestId(quoteContainer, 'pocketsListItem-EUR')).toBeTruthy();
    expect(queryByTestId(quoteContainer, 'pocketsListItem-USD')).toBeTruthy();
  });

  it('should show the exchange rate', () => {
    const testId = 'exchangeRate';
    const container = result.getByTestId('exchangeRate');

    const baseTestId = `${testId}-base`;
    const baseRate = '1';
    expect(queryByTestId(container, baseTestId)).toBeTruthy();
    expect(getByTestId(container, baseTestId)).toHaveTextContent(baseRate);

    const quoteTestId = `${testId}-quote`;
    const quoteRate = getRateDisplay(mockGBP.EUR, 4);
    expect(queryByTestId(container, quoteTestId)).toBeTruthy();
    expect(getByTestId(container, quoteTestId)).toHaveTextContent(quoteRate);
  });

  describe('When a value is entered in the base currency field', () => {
    describe('And it is not a number', () => {
      it('should not add the character to the field', () => {
        fireEvent.change(baseField, {
          target: {
            value: 'A',
          },
        });
        expect(baseField.value).toBe('');

        fireEvent.change(baseField, {
          target: {
            value: '10.3e',
          },
        });
        expect(baseField.value).toBe('10.3');
      });
    });

    describe('And it is a number', () => {
      const amount = 32.98;

      beforeEach(() => {
        fireEvent.change(baseField, {
          target: {
            value: amount.toString(),
          },
        });
      });

      it('should update the value of the field', () => {
        expect(baseField.value).toBe(amount.toString());
      });

      it('should allow a partial number with a decimal point', () => {
        fireEvent.change(baseField, {
          target: {
            value: '72.',
          },
        });
        expect(baseField.value).toBe('72.');
      });

      it('should not allow more than 2 decimals', () => {
        fireEvent.change(baseField, {
          target: {
            value: '59.2357',
          },
        });
        expect(baseField.value).toBe('59.23');
      });

      it('should set the exchanged amount in the quote currency', () => {
        const exchangedAmount = getRateDisplay(
          calculateExchangeAmount(amount, mockGBP.EUR)
        );
        expect(quoteField.value).toBe(exchangedAmount.toString());
      });

      describe('When the pocket of the base currency is changed', () => {
        let newBasePocket: HTMLElement;

        describe('And it is changed to USD (different to the quote currency)', () => {
          const newBase = 'USD';

          beforeEach(() => {
            (getRateByCurrencyPair as jest.Mock).mockImplementation(() =>
              Promise.resolve(mockUSD.EUR)
            );
            newBasePocket = getByTestId(
              baseContainer,
              `pocketsListItem-${newBase}`
            );
            fireEvent.click(newBasePocket);
          });

          it('should select the USD pocket', () => {
            expect(newBasePocket.getAttribute('aria-selected')).toBe('true');
          });

          it('should update the exchange rate', () => {
            const container = result.getByTestId('exchangeRate');
            const quoteTestId = `exchangeRate-quote`;
            const quoteRate = getRateDisplay(mockUSD.EUR, 4);
            expect(getByTestId(container, quoteTestId)).toHaveTextContent(
              quoteRate
            );
          });

          it('should update the exchanged amount in the quote currency', () => {
            const exchangedAmount = getRateDisplay(
              calculateExchangeAmount(amount, mockUSD.EUR)
            );
            expect(quoteField.value).toBe(exchangedAmount.toString());
          });
        });

        describe('And it is the same as the quote currency', () => {
          const newBase = 'EUR';

          beforeEach(() => {
            (getRateByCurrencyPair as jest.Mock).mockImplementation(() =>
              Promise.resolve(mockEUR.GBP)
            );
            newBasePocket = getByTestId(
              baseContainer,
              `pocketsListItem-${newBase}`
            );
            fireEvent.click(newBasePocket);
          });

          it('should select the EUR pocket', () => {
            expect(newBasePocket.getAttribute('aria-selected')).toBe('true');
          });

          it('should change the quote currency to the original base currency (GBP)', () => {
            const newQuotePocket = getByTestId(
              quoteContainer,
              `pocketsListItem-GBP`
            );
            expect(newQuotePocket.getAttribute('aria-selected')).toBe('true');
          });

          it('should update the exchange rate', () => {
            const container = result.getByTestId('exchangeRate');
            const quoteTestId = `exchangeRate-quote`;
            const quoteRate = getRateDisplay(mockEUR.GBP, 4);
            expect(getByTestId(container, quoteTestId)).toHaveTextContent(
              quoteRate
            );
          });

          it('should update the exchanged amount in the quote currency', () => {
            const exchangedAmount = getRateDisplay(
              calculateExchangeAmount(amount, mockEUR.GBP)
            );
            expect(quoteField.value).toBe(exchangedAmount.toString());
          });
        });
      });
    });
  });

  describe('When a number is entered in the quote currency field', () => {
    let quoteField: HTMLInputElement;
    const amount = 100.87;

    beforeEach(() => {
      quoteField = getByTestId(
        quoteContainer,
        'exchange-quote-amount'
      ) as HTMLInputElement;
      fireEvent.change(quoteField, {
        target: {
          value: amount.toString(),
        },
      });
    });

    it('should update the value of the field', () => {
      expect(quoteField.value).toBe(amount.toString());
    });

    it('should set the exchanged rate in the base currency', () => {
      const baseField = getByTestId(
        baseContainer,
        'exchange-base-amount'
      ) as HTMLInputElement;
      const exchangedAmount = getRateDisplay(
        calculateExchangeAmount(amount, mockGBP.EUR, false)
      );
      expect(baseField.value).toBe(exchangedAmount.toString());
    });
  });
});
