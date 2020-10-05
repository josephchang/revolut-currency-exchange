import * as React from 'react';
import styled from 'styled-components';
import { Pocket, SupportedCurrencies } from '../../types';
import PocketItem from '../PocketItem';

export interface PocketsProps {
  pockets: Pocket[];
  selectedCurrency: SupportedCurrencies;
  onCurrencyChange(currency: SupportedCurrencies): void;
}

interface PocketsListItemProps {
  selected: boolean;
}

const Container = styled.div``;

const PocketsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const PocketsListItem = styled.li<PocketsListItemProps>`
  cursor: pointer;
  margin-bottom: 12px;
  opacity: ${({ selected }) => (selected ? 1 : 0.4)};

  &:hover {
    opacity: 1;
  }
`;

const Pockets = ({
  selectedCurrency,
  pockets,
  onCurrencyChange,
}: PocketsProps) => {
  const selectedPocket = pockets.find(
    (pocket) => pocket.currency === selectedCurrency
  );

  const onPocketItemClick = (currency: SupportedCurrencies) => {
    if (currency !== selectedCurrency) {
      onCurrencyChange(currency);
    }
  };

  return (
    <Container data-testid="pockets">
      <PocketsList role="tablist">
        {pockets.map((pocket) => {
          const { currency } = pocket;
          const selected = pocket === selectedPocket;
          return (
            <PocketsListItem
              role="tab"
              aria-selected={selected}
              data-testid={`pocketsListItem-${currency}`}
              key={currency}
              selected={selected}
              onClick={() => onPocketItemClick(currency)}
            >
              <PocketItem {...pocket} />
            </PocketsListItem>
          );
        })}
      </PocketsList>
    </Container>
  );
};

export default Pockets;
