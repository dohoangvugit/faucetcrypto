const homeRoute = require('../routes/homeRoute')
const taskRoute = require('../routes/taskRoute')

function route (app){
    
    app.use('/admin/task', taskRoute)
    app.use('/', homeRoute)
}

module.exports = route
