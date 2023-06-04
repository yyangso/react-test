import React, { useState, useEffect } from "react";
import axios from "axios";

const CoinList = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:3001/coins");
        const coinsWithImagesAndPrices = await Promise.all(
          result.data.map(async (coin) => {
            try {
              const imageResult = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.slug}`);
              const priceResult = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${coin.symbol}USDT`);
              return {
                ...coin,
                image: imageResult.data.image.small,
                price: priceResult.data.price
              };
            } catch (error) {
              console.error(`Could not fetch data for coin ${coin.symbol}`);  // Change slug to symbol here
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
  }, []);

  return (
    <div>
      <h1>Top 10 Coins by Market Cap</h1>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id}>
            <img src={coin.image} alt={`${coin.name} logo`} />
            <p>Symbol: {coin.symbol}</p>
            <p>Market Cap: {coin.quote.USD.market_cap.toLocaleString()}</p>
            <p>Price: {parseFloat(coin.price).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinList;
