const supabase = require('../config/db');

const taskLogModel = {
    getLateLog: async (userId, taskId) => {
        const { data, error } = await supabase
            .from('task_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('task_id', taskId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error){
            console.error('Lỗi lấy log gần nhất', error.message)
            return error
        }

        return data
    },

    createTaskLog: async (logData) => {
        const { data, error } = await supabase
            .from('task_logs')
            .insert([logData])
            .select()

        if (error) {
            console.error('Lỗi tạo log', error.message)
            return error
        }

        return data
    }
}

module.exports = taskLogModel
