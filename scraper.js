const cheerio = require("cheerio");
const axios = require("axios");
const siteUrl = "https://themoviespoiler.com/movies/birds-of-prey/";
let siteName = "";
const categories = new Set();
const fetchData = async () => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};
const getResults = async () => {
    const $ = await fetchData();
    siteName = $('entry-title').text();
    $(".entry-content>p").each((index, element) => {
      categories.add($(element).text());
    });
  return {
    categories: [...categories].sort(),
    siteName,
   };
  };
  module.exports = getResults;