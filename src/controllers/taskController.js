const taskModel = require('../models/taskModel')

const TaskController = {

    async index(req,res){
        try {
            const tasks = await taskModel.getTasks()
            res.json(tasks)                           
        } catch (err) {
            console.error('lỗi lấy tasks', err)
        }
    },

    async create(req, res) {
        try{
            const task = req.body;
            const newTask = await taskModel.create(task)
            res.json(newTask)
        }catch(err){
            console.error('lỗi tạo tasks', err)
            
        }
        
    },

    async delete(req, res) {
        try{
            const id = req.params.id;
            await taskModel.delete(id);
            res.json({ message: 'Task đã được xóa' })
        }catch(err){
            console.error('lỗi xóa tasks', err)
        }
    },

    async update(req, res) {
        try{
            const id = req.params.id;
            const updates = req.body;
            const updatedTask = await taskModel.update(id, updates)
            res.json(updatedTask);
        }catch(err){
            console.error('lỗi sửa tasks', err)
        }
    }
}

module.exports = TaskController
