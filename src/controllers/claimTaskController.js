const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const taskLogModel = require('../models/taskLogModel')

const taskController = {
    startTask: async (req, res) => {
        const { taskId } = req.body
        const authUserId = req.session.user.auth_user_id

        try {
            const task = await taskModel.getTasksById(taskId);
            if (!task || task.is_active === false) {
                return res.status(400).json({ error: 'QC ko còn' })
            }

            const logData = {
                user_id: authUserId,
                task_id: taskId,
                status: 'pending', 
                reward_amount: 0,
            }

            await taskLogModel.createTaskLog(logData)

            return res.json({ 
                success: true, 
                message: 'start',
                cooldown: task.cooldown_seconds 
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    claimReward: async (req, res) => {
        const { taskId } = req.body
        const authUserId = req.session.user.auth_user_id

        try {
            const task = await taskModel.getTasksById(taskId)

            if (!task || task.is_active === false) {
                return res.status(400).json({ error: 'QC ko còn' })
            }
            
            const lastLog = await taskLogModel.getLateLog(authUserId, taskId)

            if (!lastLog) {
                return res.status(400).json({ error: 'Bạn chưa bắt đầu xem quảng cáo này' })
            }

            if (lastLog.status === 'completed') {
                return res.status(400).json({ error: 'Bạn đã nhận thưởng cho quảng cáo này rồi' })
            }

            const now = new Date()
            const startTime = new Date(lastLog.created_at)
            const secondsElapsed = (now - startTime) / 1000

            if (secondsElapsed < task.cooldown_seconds) {
                const diff = Math.ceil(task.cooldown_seconds - secondsElapsed)
                return res.status(400).json({ error: `ban con ${diff}s` })
            }

            const allUsers = await userModel.getUsers()
            const currentUser = allUsers.find(user => user.auth_user_id === authUserId)

            if (!currentUser) {
                return res.status(404).json({ error: 'Người dùng không hợp lệ' })
            }
            
            const newBalance = parseFloat(currentUser.balance) + parseFloat(task.reward_amount)
            await userModel.updateUser(currentUser.id, { balance: newBalance })

            await taskLogModel.createTaskLog({
                user_id: authUserId,
                task_id: taskId,
                status: 'completed',
                reward_amount: task.reward_amount,
            })

            req.session.user.balance = newBalance

            return req.session.save(() => {
                res.json({ 
                    success: true, 
                    reward: task.reward_amount, 
                    newBalance 
                })
            })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
};

module.exports = taskController
