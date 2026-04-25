const userModel = require('../models/userModel')

const userController = {

    async index(req, res) {   
        try {
            const users = await userModel.getUsers()
            res.status(200).json(users)
        } catch (err) {
            console.error('Lỗi lấy user', err)
            res.status(500).json({ error: 'Lỗi lấy user', message: err.message })
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id
            const userUpdates = req.body
            const updatedUser = await userModel.updateUser(id, userUpdates)

            if(!updatedUser || updatedUser.length === 0){
                return res.status(400).json({ error: 'User không tồn tại' })
            }
            res.status(200).json(updatedUser)
        } catch (err) {
            console.error('Lỗi cập nhật user', err)
            res.status(500).json({ error: 'Lỗi cập nhật user', message: err.message })
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id

            if (!id) {
            return res.status(400).json({ message: 'Thiếu id' })
            }

            const deletedUser = await userModel.deleteUser(id)

            if (!deletedUser || deletedUser.length === 0) {
            return res.status(404).json({ message: 'User không tồn tại' })
            }

            res.status(200).json({ message: 'User đã được xóa' })
        } catch (err) {
            console.error('Lỗi xóa user', err)
            res.status(500).json({
            error: 'Lỗi xóa user',
            message: err.message
            })
        }
    }
}

module.exports = userController
