const express = require("express");
const router = express.Router();
const getResults = require("../scraper");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const client = new MongoClient(process.env.DATABASE_URL, { useNewUrlParser: true });

client.connect(err => {
  const collection = client.db("test").collection("myCollection");
  var stream = collection.find({mykey:{$ne:2}}).stream();
  stream.on("data", function(item) {});
  stream.on("end", function() {});
  console.log(stream);
  client.close();
});

router.get("/", async function(req, res, next) {
  const result = await getResults();
  result.categories = wordSort(result.categories);
  res.render("index", result);
});
function wordSort(paralist) {
  wordArr = [];
  for(let i = 0; i < paralist.length; i++) {
    let wordlist = paralist[i].split(" ");
    let sentencelist = paralist[i].split(".");
    for(let j = 0; j < wordlist.length; j++) {
      if((wordlist[j].charAt(0) == wordlist[j].charAt(0).toUpperCase() && wordlist[j].charAt(0).match(/[a-z]/i)) || wordlist[j].length >= 6) {
        wordArr.push(wordlist[j]);
      }
    }
  }
  return wordArr;
}
module.exports = router;