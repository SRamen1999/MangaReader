const express = require('express');
const request = require('request');

const app = express()
var cors = require('cors')

app.use(express.json({limit: '50mb'}));
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/topViewManga', (req, res) => {
    request(
      { url: 'https://mangadb-search.herokuapp.com/mangadb?sortby=views&ascending=false&nsfw=false&limit=15&skip=0' },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ type: 'error', message: err.message });
        }
  
        res.json(JSON.parse(body));
      }
    )
  });

  app.get('/topRatingManga', (req, res) => {
    request(
      { url: 'https://mangadb-search.herokuapp.com/mangadb?sortby=rating&ascending=false&nsfw=false&limit=15&skip=0' },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ type: 'error', message: err.message });
        }
  
        res.json(JSON.parse(body));
        
      }
    )
  });
  
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => console.log(`listening on ${PORT}`));