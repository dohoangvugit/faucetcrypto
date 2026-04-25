const supabase = require('../config/db');

const userModel = {

    getUsers: async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')

        if (error) {
            console.error('Lỗi lấy user', error.message)
            throw error
        }
        console.log('Lấy user thành công', data)
        return data
    },

    updateUser: async (id, user) => {   
        const { data, error } = await supabase
            .from('users')
            .update(user)
            .eq('id', id)
            .select()
        if (error) {
            console.error('Lỗi cập nhật user', error.message)
            throw error
        }
        console.log('Cập nhật user thành công', data)
        return data
    },

    deleteUser: async (id) => { 
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
            .select()
        if (error) {
            console.error('Lỗi xóa user', error.message)
            throw error
        }
        console.log('Xóa user thành công', data)
        return data
    }

}

module.exports = userModel


// userModel.deleteUser(16) //id đúng


// userModel.getUsers()
// userModel.updateUser(4, { username: 'Test update', role: 'admin' })