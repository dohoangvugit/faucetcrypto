const homeRoute = require('../routes/homeRoute')
const taskRoute = require('../routes/taskRoute')
const authRoute = require('../routes/authRoute')
const clientTasksRoute = require('../routes/clientTasksRoute')
const userRoute = require('../routes/userRoute')
const withdrawRoute = require('../routes/withdraw')
function route (app){
    app.use('/admin/users', userRoute)
    app.use('/client', clientTasksRoute)
    app.use('/admin/task', taskRoute)
    app.use('/', withdrawRoute)
    app.use('/', homeRoute)
    app.use('/', authRoute)

}

module.exports = route
