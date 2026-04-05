require('dotenv').config()
const taskModel = require('../models/taskModel')

const tasksClientController = {
    listClientTasks: async (req, res) => {
        try {
            const tasks = await taskModel.getTasks()
            res.render('client/tasks', {
                layout: 'client',
                user: req.session.user,
                tasks,
                supabaseUrl: process.env.SUPABASE_URL,
                supabaseKey: process.env.SUPABASE_ANON_KEY
            })
        } catch (err) {
            console.error('Lỗi lấy tasks cho client', err)
            res.status(500).send('Có lỗi xảy ra')
        }
    }
}

module.exports = tasksClientController