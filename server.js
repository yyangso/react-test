const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/coins', async (req, res) => {
  try {
    const result = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "d2d827a6-129e-40f5-8239-feedcb8e04fc"
        }
      }
    );

    const topCoins = result.data.data.filter(coin => !coin.tags.includes('stablecoin'));
    res.json(topCoins);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
