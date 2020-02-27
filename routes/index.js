const express = require("express");
const router = express.Router();
const getResults = require("../scraper");
/* GET home page. */
router.get("/", async function(req, res, next) {
  const result = await getResults();
  result.categories = wordSort(result.categories);
  res.render("index", result);
});
function wordSort(paralist) {
  wordArr = [];
  for(let i = 0; i < paralist.length; i++) {
    let wordlist = paralist[i].split(" ");
    for(let j = 0; j < wordlist.length; j++) {

      if(wordlist[j].charAt(0) == wordlist[j].charAt(0).toUpperCase() && wordlist[j].charAt(0).match(/[a-z]/i)) {
        wordArr.push(wordlist[j]);
      }
    }
  }
  return wordArr;
}
module.exports = router;