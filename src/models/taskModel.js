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
                is_active: task.is_active ?? true,
                link_url: task.link_url
            },
        ])
        .select()

        if (error) {
            console.error('Thêm thất bại', error.message);
        } else {
            console.log('Thêm thành công');
        }

        return data

    },

    delete: async (id) =>{
        
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

        if (error) {
            console.error('Xóa thất bại', error.message);
        } else {
            console.log('Xóa thành công');
        }

    }


}

module.exports = taskModel

// test 

// taskModel.create({ title: 'Test Task3', reward_amount: 0.01, link_url: 'https://earnbitmoon.club' })
// taskModel.delete(4)

