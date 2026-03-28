const taskModel = require('../models/taskModel')

const TaskController = {

    async index(req,res){
        try {

            const tasks = await taskModel.getTasks()
            res.status(200).json(tasks)       

        } catch (err) {
            console.error('lỗi lấy tasks', err)
            res.status(500).json({ message: 'Lỗi lấy task', error: err.message })

        }
    },

    async create(req, res) {
        try{
            const task = req.body

            if (!task.title || !task.reward_amount || !task.link_url){
                return res.status(400).json({
                    message: "thiếu dữ liệu bắt buộc"
                })
            }

            const newTask = await taskModel.create(task)
            res.status(201).json(newTask)

        }catch(err){
            console.error('lỗi tạo tasks', err)
            res.status(500).json({ message: 'Lỗi tạo task', error: err.message })
        }
    },

    async delete(req, res) {
        try{
            const id = req.params.id

            if(!id){
                return res.status(400).json({
                    message: "id không tồn tại"
                })
            }
            await taskModel.delete(id)
            res.status(204).json({ message: 'đã xóa task'})
        }catch(err){
            console.error('lỗi xóa tasks', err)
            res.status(500).json({ message: 'Lỗi xóa task', error: err.message })
        }
    },

    async update(req, res) {
        try{
            const id = req.params.id;
            const updates = req.body;
            const updatedTask = await taskModel.update(id, updates)

            if (!updatedTask){
                return res.status(400).json({message: 'task không tồn tại'})
            }
            res.status(200).json(updatedTask);
        }catch(err){
            console.error('lỗi sửa tasks', err)
            res.status(500).json({ message: 'Lỗi sửa task', error: err.message })
        }
    }
}

module.exports = TaskController
