const supabase = require('../config/db');

const taskModel = {
    
    create: async (task) => {

    const { data, error } = await supabase
        .from('tasks')
        .insert([
            { 
                title: task.title,
                reward_amount: task.reward_amount,
                cooldown_seconds: task.cooldown_seconds ?? 30,
                is_active: task.is_active ?? true
            },
        ])
        .select()

    if (error) throw error

    return data

    },
}

module.exports = taskModel
