const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const reviewsCtrl = require('../controllers/reviews');

router.post('/movies/:id/reviews', reviewsCtrl.create);
	
module.exports = router;
