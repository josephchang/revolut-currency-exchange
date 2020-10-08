import { Pocket, SupportedCurrencies } from '../types';

type Exchange = {
  currency: SupportedCurrencies;
  amount: number;
};

const doesExceedBalance = (
  currency: SupportedCurrencies,
  pockets: Pocket[],
  amount: number
): boolean => {
  const pocket = getPocketByCurrency(currency, pockets);
  return pocket ? pocket.balance < amount : true;
};

const getPocketByCurrency = (
  currency: SupportedCurrencies,
  pockets: Pocket[]
) => pockets.find((pocket) => pocket.currency === currency);

const updatePocketBalances = (
  pockets: Pocket[],
  baseCurrency: SupportedCurrencies,
  baseAmount: number,
  quoteCurrency: SupportedCurrencies,
  quoteAmount: number
): Pocket[] =>
  pockets.map(({ currency, balance }) => {
    if (currency === baseCurrency) {
      return {
        currency,
        balance: balance - baseAmount,
      };
    } else if (currency === quoteCurrency) {
      return {
        currency,
        balance: balance + quoteAmount,
      };
    }
    return { currency, balance };
  });

export { doesExceedBalance, getPocketByCurrency, updatePocketBalances };
