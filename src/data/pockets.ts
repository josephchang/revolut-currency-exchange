import { Pocket } from '../types';

const pockets: Pocket[] = [
  {
    currency: 'GBP',
    balance: 89.22,
  },
  {
    currency: 'EUR',
    balance: 194.83,
  },
  {
    currency: 'USD',
    balance: 0,
  },
];

const getPockets = () => [...pockets];

export { getPockets };
