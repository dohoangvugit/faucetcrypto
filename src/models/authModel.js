const supabase = require('../config/db')

const authModel = {

    register: async (email, username, password) => {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        })

        if (error) {
            // console.error('Đăng ký thất bại:', error.message)
            return { error: error.message }
        }

        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    username,
                    email,
                    created_at: new Date()
                }
            ])

        if (insertError) {
            // console.error('Lỗi insert user:', insertError.message)
            return { error: insertError.message }
        }

        // console.log('Đăng ký thành công:', data)
        return {
            success: true,
            user: data.user,
            err: null
        }
    },

    login: async (email, password) =>{
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            // console.error('Đăng nhập thất bại:', error.message)
            // console.error('Mã lỗi', error.status)
            return { success: false, error: error.message }
        }

        const user = data.user
        if (!user.confirmed_at) {
            // console.error('Mail chưa xác thực')
            return { success: false, error: error.message }
        }
        
        let { data: users, error: errRole } = await supabase
            .from('users')
            .select('role')
            .eq('email', email)
        
        if(errRole){
            return {success: false, error: errRole }
        }

        const role = users.role || 'client'
        // console.log('Đăng nhập thành công', data)
        // console.log(role)
        return { success: true, user: data.user, role }   
    },

    logout: async ()=>{
        const { error } = await supabase.auth.signOut()
        if (error){
            // console.error('đăng xuất thất bại', error.message )
            return { success: false, error: error.message }
        }
        // console.log('Đăng xuất thành công')
        return{success: true}
    }

}

module.exports = authModel

// async function testLogout (){
//     const testLogin1 = await authModel.login('vuker12345@gmail.com','hoangvu')
//     const logout = await authModel.logout()
// }
// testLogout()

// const testLogin1 = authModel.login('vuker12345@gmail.com','hoangvu')    // mail đúng, mật khẩu đúng, đã xác nhận
// const testLogin2 = authModel.login('vuker12345@gmail.com','saimatkhau') // mail đúng mật khẩu sai
// const testLogin3 = authModel.login('vuker123456@gmail.com','hoangvu')   // mail, đúng mật khẩu đúng, chưa xác nhận


// const testRegister = authModel.register('vuker123456@gmail.com', 'hoangvu123', 'hoangvu')  // tk ảo
// const testRegister1 = authModel.register('vuker12345@gmail.com', 'Test', 'hoangvu')        // tk REAL