const express = require("express");
const router = express.Router();
const getResults = require("../scraper");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



router.get("/", async function (req, res, next) {
  const result = await getResults();
  result.categories = wordSort(result.categories);
  let resultCategories = result.categories;
  MongoClient.connect(process.env.DATABASE_URL, (err, db) => {
    if (err) throw err;
    const testDB = db.db("test");
    let exists = testDB.collection("testCollection").findOne({ name: result.siteName }).then(function (results) {
      if (results == null) {
        let doc = { name: result.siteName, result: resultCategories };
        testDB.collection("testCollection").insertOne(doc, function (err, res) {
          if (err) {
            console.log(err);
            throw err;
          }
          if (res)
            console.log("Inserting data from " + result.siteName);
          db.close();
        });
      }
      else
        console.log(result.siteName + " already exists!");
    });
  });
  res.render("index", result);
});
function wordSort(paralist) {
  wordArr = [];
  for (let i = 0; i < paralist.length; i++) {
    let wordlist = paralist[i].split(" ");
    let sentencelist = paralist[i].split(".");
    for (let j = 0; j < wordlist.length; j++) {
      if ((wordlist[j].charAt(0) == wordlist[j].charAt(0).toUpperCase() && wordlist[j].charAt(0).match(/[a-z]/i)) || wordlist[j].length >= 6) {
        wordArr.push(wordlist[j]);
      }
    }
  }
  return wordArr;
}
module.exports = router;