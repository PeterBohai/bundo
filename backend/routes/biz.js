const router = require("express").Router();

router.route("/:bizAlias").get(function(req, res){
	let bizAlias = req.params.bizAlias;
	res.json(`Returning test results for query if ${bizAlias}`);
});

module.exports = router;