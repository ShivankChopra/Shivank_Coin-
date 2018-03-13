const express = require('express');
const Blockchain = require('../blockchain/main.blockchain.js');
const P2pServer = require('./p2p-server.js');
const bodyParser = require('body-parser');

const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);
const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3001;

// for parsing incoming request as json
app.use(bodyParser.json());

// get blockchain
app.get('/blocks', (req, res) => {
  res.json(p2pServer.blockchain.chain);
});

// mine a new block with given data
app.post('/mine', (req, res) => {
  p2pServer.blockchain.addNewBlock(req.body.data);
  p2pServer.syncronizeChain();
  res.status(200).send("Syncronized chain on all peers");
});

app.listen(HTTP_PORT, () => {
  console.log(`Started server on port ${HTTP_PORT}.`);
});

p2pServer.listen();
