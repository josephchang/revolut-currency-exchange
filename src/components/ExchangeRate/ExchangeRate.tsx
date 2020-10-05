import * as React from 'react';
import styled from 'styled-components';
import { SupportedCurrencies } from '../../types';
import { getCurrencySymbol } from '../../utils/currency';
import { getRateDisplay } from '../../utils/rates';

export interface ExchangeRateProps {
  base: SupportedCurrencies;
  quote: SupportedCurrencies;
  rate: number;
}

const Container = styled.div`
  background: #fff;
  border: 2px solid #edddd4;
  border-radius: 12px;
  color: #772e25;
  font-size: 12px;
  padding: 4px 8px;
  text-align: center;
`;

const ExchangeRate = ({ base, quote, rate }: ExchangeRateProps) => {
  if (rate === 0) {
    return <Container data-testid="exchangeRate">...</Container>;
  }

  const baseText = `${getCurrencySymbol(base)}1`;
  const quoteText = `${getCurrencySymbol(quote)}${getRateDisplay(rate, 4)}`;

  return (
    <Container data-testid="exchangeRate">
      <span data-testid="exchangeRate-base">{baseText}</span>
      <span>&nbsp;=&nbsp;</span>
      <span data-testid="exchangeRate-quote">{quoteText}</span>
    </Container>
  );
};

export default ExchangeRate;
