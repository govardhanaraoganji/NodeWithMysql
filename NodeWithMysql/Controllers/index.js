var express = require('express')
	, router = express.Router();

router.use('/user', require('./User/Users').router);

module.exports = router;