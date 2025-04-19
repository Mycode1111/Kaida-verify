const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Keep-alive server is running on port ${PORT}`);
});
