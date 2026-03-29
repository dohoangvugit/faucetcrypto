const homeRoute = require('../routes/homeRoute')
const taskRoute = require('../routes/taskRoute')
const authRoute = require('../routes/authRoute')

function route (app){
    
    app.use('/admin/task', taskRoute)
    app.use('/', homeRoute)
    app.use('/', authRoute)

}

module.exports = route
