const express = require('express');
const router = express.Router();
const rp = require('request-promise');

module.exports = router;

router.get('/movies', (req, res) => {
  const params = req.query;
  rp('https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0')
  .then((result) => {
    res.json(JSON.parse(result));
  })
});
