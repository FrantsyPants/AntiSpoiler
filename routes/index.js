const express = require("express");
const router = express.Router();
const getResults = require("../scraper");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

router.get("/", async function (req, res, next) {
  let result = await getResults();
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
  try {
  let resultObj = {theResult: result};
  await getReviews(resultObj).then(res.render("index", resultObj.theResult));//not working(res.render is doing it before it gets the resultObj back)
  }catch(err) {console.log(err);}//it is doing this because it is not awaiting getReviews(the page is rendering too early)
});
//NOT WORKING, IT COULDNT RETURN BEFORE res.render... STARTED AND WOULD ONLY GIVE AN EMPTY ARRAY
const getReviews = async (resultObj) => {
  let reviews = [];
  await MongoClient.connect(process.env.DATABASE_URL, (err, db) => {
    if (err) throw err;
    const testDB = db.db("test");
    let exists = testDB.collection("testCollection").find({}).toArray(function (err, result) {
      if(err) throw err;
      resultObj.theResult = result;
      console.log('asdf')
      db.close();
    });
  });
  console.log(reviews)//does this before the MongoClient returns
}
function wordSort(paralist) {
  let stopWords = []
  let wordArr = [];
  for (let i = 0; i < paralist.length; i++) {
    let sentencelist = paralist[i].split(".");
    for (let k = 0; k < sentencelist.length; k++) {
      let wordlist = sentencelist[k].split(" ");
      for(let j = 0; j < wordlist.length; j++) {
        if (((wordlist[j].charAt(0) == wordlist[j].charAt(0).toUpperCase() && wordlist[j].charAt(0).match(/[a-z]/i)) || wordlist[j].length >= 6) && !stopWords.includes(wordlist[j]))
          wordArr.push({sentence: k, word: wordlist[j]});
      }
    }
  }
  return wordArr;
}
module.exports = router;