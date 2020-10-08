import * as React from 'react';
import styled from 'styled-components';
import { getCurrencySymbol } from '../../utils/currency';
import { getRateDisplay } from '../../utils/rates';
import { Pocket } from '../../types';

const Container = styled.div``;

const Currency = styled.div`
  font-size: 32px;
`;

const Balance = styled.div`
  font-size: 12px;
`;

const PocketItem = ({ currency, balance }: Pocket) => (
  <Container data-testid={`pocket-${currency}`}>
    <Currency data-testid={`pocket-${currency}-label`}>
      {currency.toUpperCase()}
    </Currency>
    <Balance data-testid={`pocket-${currency}-balance`}>
      Balance: {`${getCurrencySymbol(currency)}${getRateDisplay(balance)}`}
    </Balance>
  </Container>
);

export default PocketItem;
