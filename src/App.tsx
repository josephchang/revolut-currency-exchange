import * as React from 'react';
import styled from 'styled-components';
import makeCancelable from 'makecancelable';
import { Decimal } from 'decimal.js';
import { getPockets } from './data/pockets';
import { getRateByCurrencyPair } from './data/rates';
import Pockets from './components/Pockets';
import ExchangeRate from './components/ExchangeRate';
import { calculateExchangeAmount, getRateDisplay } from './utils/rates';
import { doesExceedBalance, updatePocketBalances } from './utils/pockets';
import { Pocket, SupportedCurrencies } from './types';

export interface AppProps {}

export interface AppState {
  base: SupportedCurrencies | null;
  pockets: Pocket[];
  quote: SupportedCurrencies | null;
  rate: number;
  baseAmount?: string;
  quoteAmount?: string;
}

const Container = styled.div`
  height: 100vh;

  * {
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  align-items: center;
  color: #fff;
  display: flex;
  height: 50vh;
  justify-content: space-between;
  padding: 20px;
`;

const BaseWrapper = styled(Wrapper)`
  background: #283d3b;
  position: relative;
`;

const QuoteWrapper = styled(Wrapper)`
  background: #197278;
`;

const AmountField = styled.input`
  background: none;
  border: 0;
  color: #fff;
  font-size: 60px;
  max-width: 50vw;
  outline: 0;
  text-align: right;

  &::placeholder {
    color: #fff;
  }
`;

const ExchangeRateWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 40px;
  margin-top: -20px;
  position: absolute;
  width: 100%;
`;

const ExchangeButton = styled.button`
  background: #fff;
  border: 4px solid #19727888;
  border-radius: 40px;
  bottom: 20px;
  height: 80px;
  left: 50%;
  margin-left: -40px;
  outline: 0;
  position: absolute;
  width: 80px;

  &:hover {
    background: #283d3b88;
    color: #fff;
  }

  &:disabled {
    background: #ddd;
    border-color: #999;
    color: #aaa;
  }
`;

class App extends React.Component<AppProps, AppState> {
  poller: any;
  cancelableRateRequest: any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      base: null,
      pockets: [],
      quote: null,
      rate: 0,
    };
  }

  componentDidMount() {
    const pockets = getPockets();
    this.setState(
      {
        base: pockets[0] ? pockets[0].currency : null,
        quote: pockets[1] ? pockets[1].currency : null,
        pockets,
      },
      () => {
        this.getRate();
        this.startPoll();
      }
    );
  }

  componentWillUnmount() {
    this.stopPoll();
    if (this.cancelableRateRequest) {
      this.cancelableRateRequest();
    }
  }

  startPoll() {
    this.poller = setInterval(this.getRate, 10 * 1000);
  }

  stopPoll() {
    if (this.poller) {
      clearInterval(this.poller);
    }
  }

  getRate = async () => {
    const { base, quote } = this.state;
    if (this.cancelableRateRequest) {
      this.cancelableRateRequest();
    }

    this.cancelableRateRequest = makeCancelable(
      getRateByCurrencyPair(`${base}${quote}`),
      (rate: number) => {
        const { baseAmount } = this.state;
        let quoteAmount = '';

        if (baseAmount) {
          const exchangeAmount = calculateExchangeAmount(
            Number(baseAmount),
            rate
          );
          quoteAmount = getRateDisplay(exchangeAmount);
        }

        this.setState({
          quoteAmount,
          rate,
        });
      },
      console.error
    );
  };

  onBaseChange = (newBase: SupportedCurrencies) => {
    const { base, quote } = this.state;
    this.stopPoll();
    this.setState(
      {
        base: newBase,
        quote: newBase === quote ? base : quote,
      },
      this.getRate
    );
    this.startPoll();
  };

  onQuoteChange = (newQuote: SupportedCurrencies) => {
    const { base, quote } = this.state;
    this.stopPoll();
    this.setState(
      {
        base: newQuote === base ? quote : base,
        quote: newQuote,
      },
      this.getRate
    );
    this.startPoll();
  };

  onAmountChange = (fromBase = true) => (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    let inputValue = ev.target.value;
    let amount = new Decimal(Number(inputValue));

    while (amount.isNaN() || amount.mul(100).mod(1).toNumber() !== 0) {
      inputValue = inputValue.substring(0, inputValue.length - 1);
      if (inputValue === '') {
        return;
      }
      amount = new Decimal(Number(inputValue));
    }

    const exchangeAmount = calculateExchangeAmount(
      amount.toNumber(),
      this.state.rate,
      fromBase
    );

    this.setState({
      baseAmount: fromBase ? inputValue : getRateDisplay(exchangeAmount),
      quoteAmount: fromBase ? getRateDisplay(exchangeAmount) : inputValue,
    });
  };

  onExchangeButtonClick = () => {
    const { base, baseAmount, quote, quoteAmount, pockets } = this.state;

    if (base && baseAmount && quote && quoteAmount) {
      const updatedPockets = updatePocketBalances(
        pockets,
        base,
        Number(baseAmount),
        quote,
        Number(quoteAmount)
      );
      this.setState({
        pockets: updatedPockets,
        baseAmount: undefined,
        quoteAmount: undefined,
      });
    }
  };

  render() {
    const { base, baseAmount, pockets, quote, quoteAmount, rate } = this.state;

    if (!base || !quote) {
      return null;
    }

    const exceedsBalance = doesExceedBalance(base, pockets, Number(baseAmount));
    return (
      <Container>
        <BaseWrapper data-testid="exchange-base">
          <Pockets
            selectedCurrency={base}
            pockets={pockets}
            onCurrencyChange={this.onBaseChange}
          />
          <div>
            <AmountField
              data-testid="exchange-base-amount"
              type="text"
              placeholder={!baseAmount ? '0' : undefined}
              onChange={this.onAmountChange(true)}
              value={baseAmount ?? ''}
            />
          </div>
        </BaseWrapper>
        <ExchangeRateWrapper>
          <ExchangeRate base={base} quote={quote} rate={rate} />
        </ExchangeRateWrapper>
        <QuoteWrapper data-testid="exchange-quote">
          <Pockets
            selectedCurrency={quote}
            pockets={pockets}
            onCurrencyChange={this.onQuoteChange}
          />
          <div>
            <AmountField
              data-testid="exchange-quote-amount"
              type="text"
              placeholder={!quoteAmount ? '0' : undefined}
              onChange={this.onAmountChange(false)}
              value={quoteAmount ?? ''}
            />
          </div>
        </QuoteWrapper>
        <ExchangeButton
          data-testid="exchange-button"
          type="button"
          disabled={exceedsBalance}
          onClick={this.onExchangeButtonClick}
        >
          Exchange
        </ExchangeButton>
      </Container>
    );
  }
}

export default App;
