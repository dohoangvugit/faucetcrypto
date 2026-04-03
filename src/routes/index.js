const homeRoute = require('../routes/homeRoute')
const taskRoute = require('../routes/taskRoute')
const authRoute = require('../routes/authRoute')
const clientTasksRoute = require('../routes/clientTasksRoute')

function route (app){
    app.use('/client', clientTasksRoute)
    app.use('/admin/task', taskRoute)
    app.use('/', homeRoute)
    app.use('/', authRoute)

}

module.exports = route
