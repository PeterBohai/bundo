const router = require('express').Router()

router.route('/:bizAlias').get((req, res) => {
	let bizAlias = req.params.bizAlias
	res.json(`Returning test results for query: ${bizAlias}`)
})

module.exports = router