const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const searchRouter = require('./routes/search')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const User = require('./models/user')

const app = express()
app.use(cors({credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('client/build'))		// Serve static React build for 3001 or production url
app.use(morgan(logger.httpLogFormat))		// HTTP request logger

let userInfo = {}

mongoose.connect(config.MONGO_ATLAS_URI, {
	useNewUrlParser: true, 
	useCreateIndex: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false}
)
	.then(() => {
		logger.info('Connected to MongoDB Atlas')
	})
	.catch(err => {
		logger.error('Error connecting to MongoDB Atlas: ', err.message)
	})

// server routes 
app.use('/api/search', searchRouter)
app.use('/api/user', userRouter)
app.use('/auth', authRouter)

app.post('/save', (req, res, next) => {
	let savedBiz = req.body.targetBusiness

	if (req.body.save){
		User.findOneAndUpdate({username: userInfo.email}, {$push: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				next(err)
			} else {
				logger.info('Added a new bookmark to current user! [/save]')
				userInfo.bookmarks = result.bookmarks
				logger.debug(userInfo.bookmarks)
				// userInfo.bookmarks = req.user.bookmarks;
			}
		})
	} else {
		User.findOneAndUpdate({username: userInfo.email}, {$pull: {bookmarks: savedBiz}}, function (err, result){
			if (err) {
				next(err)
			} else {
				logger.info('Deleted a new bookmark from current user! [/save]')
				userInfo.bookmarks = result.bookmarks
				logger.debug(userInfo.bookmarks)
			}
		})
	}
	

})

// reroute any client-side paths (not handled by server)
app.get('*', (req, res) =>{
	res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// custom error handler
app.use(middleware.errorHandler)

const port = config.PORT || 3001
app.listen(port, () => {
	logger.info(`Server started on PORT ${port}`)
})
