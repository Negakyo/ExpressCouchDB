const express = require('express')
const app = express()
const auth = require('../middleware/auth')

const bookRouter = require('./bookRouter')
const userRouter = require('./userRouter')

app.get('/', (req, res) => {
    res.send('<h1>API de livres</h1>')
})

app.use('/books', auth, bookRouter)
app.use('/users', userRouter)

module.exports = app
