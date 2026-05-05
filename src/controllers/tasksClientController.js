const {getTasks} = require('../models/taskModel')

const tasksClientController = {
    listClientTasks: async (req, res) => {
        try {
            const tasks = await getTasks()
            res.render('client/tasks', {
                layout: 'client',
                user: req.session.user,
                tasks
            })
        } catch (err) {
            console.error('Lỗi lấy tasks cho client', err)
            res.status(500).json({ error: 'Có lỗi xảy ra' })
        }
    }
}

module.exports = tasksClientController