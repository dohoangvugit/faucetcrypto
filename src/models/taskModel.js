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
                description: task.description ?? '',
                is_active: task.is_active ?? true,
                link_url: task.link_url
            },
        ])
        .select()

        if (error) {
            throw error
            // console.error('Thêm thất bại', error.message)
        } else {
            // console.log('Thêm thành công')
        }

        return data

    },

    delete: async (id) =>{
        
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

        if (error) {
            throw error
            // console.error('Xóa thất bại', error.message);
        } else {
            // console.log('Xóa thành công');
        }

    },

    getTasks: async() =>{
        
        let { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
        
        if (error) {
            throw error
            // console.error('không lấy được data', error.message);
        } else {
            // console.log('lấy thành công', tasks);
            return tasks
        }
    },

    update: async (id, updates) =>{
        
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) {
            throw error
            // console.error('sửa thất bại', error.message);
        } else {
            // console.log('sửa thành công', data);
            return data
        }
    }


}

module.exports = taskModel


