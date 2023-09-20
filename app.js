require('dotenv/config')
const bodyParser = require("body-parser")
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const productsRouter=require('./routes/products')
const categoriesRouter=require('./routes/categories')
const ordersRouter=require('./routes/orders')
const usersRouter=require('./routes/users')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')
const app = express()
const api = process.env.API_URL

app.use(cors())
app.options('*',cors())

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use( errorHandler);

//Routers
app.use(`${api}/products` , productsRouter)
app.use(`${api}/categories` , categoriesRouter)
app.use(`${api}/orders` , ordersRouter)
app.use(`${api}/users` , usersRouter)


mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log(`connected to db`)
    })
    .catch((err) => {
        console.log(err)
    })


app.listen(5000, () => {
    console.log('server is running on port 5000')
})