import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const CoinList = () => {
  const [coins, setCoins] = useState([]);

  const formatMarketCap = (marketCap) => {
    let format = '';
    if (marketCap >= 1e9) {
      format = (marketCap / 1e9).toFixed(2) + 'B';
    } else if (marketCap >= 1e6) {
      format = (marketCap / 1e6).toFixed(2) + 'M';
    } else if (marketCap >= 1e3) {
      format = (marketCap / 1e3).toFixed(2) + 'K';
    } else {
      format = marketCap.toFixed(2);
    }
    return format.split('.').map((part, idx) => idx === 0 ? parseInt(part, 10).toLocaleString() : part).join('.');
  }

  const formatPrice = (price) => {
    let [whole, fraction] = parseFloat(price).toFixed(4).split('.');
    fraction = fraction.replace(/0+$/, ""); // remove trailing zeroes
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fraction.length > 0 ? [whole, fraction].join('.') : whole;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:3001/coins");
        const coinsWithImagesAndPrices = await Promise.all(
          result.data.map(async (coin) => {
            try {
              const priceResult = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${coin.symbol}USDT`);
              return {
                ...coin,
                price: priceResult.data.price
              };
            } catch (error) {
              console.error(`Could not fetch data for coin ${coin.symbol}`);
              return coin;
            }
          })
        );        
        setCoins(coinsWithImagesAndPrices);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 300000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className="coin-container1">BLIND WHALE</h1>
      <h1 className="coin-container">Top 10 Coins - Avg</h1>
      <ul className="coin-list">
        {coins.map(coin => (
          <li key={coin.id}>
            <h2 className="coin-name">{coin.name}  ({coin.symbol})<span className="green-text">       $ {formatPrice(coin.price)}</span><span className="coin-name2">              시가총액: $ {formatMarketCap(coin.quote.USD.market_cap)}</span></h2>
            <hr className="horizontal-line" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinList;
