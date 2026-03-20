const homeRoute = require('../routes/homeRoute')

function route (app){
    app.use('/', homeRoute)
}

module.exports = route
