const supabase = require('../config/db')

const authModel = {
    register: async (emailUser, usernamUser, password) => {
        const email = emailUser.trim().toLowerCase()
        const username = usernamUser.trim()

        const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (existingUserError) {
            return { success: false, error: existingUserError.message }
        }

        if (existingUser) {
            return { success: false, error: 'Email da ton tai' }
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password,
            options: {
                data: {
                    username
                },
            },
        })

        if (error) {
            return { success: false, error: error.message }
        }

        if (!data?.user?.id) {
            return { success: false, error: 'Khong tao duoc tai khoan' }
        }

        const { error: insertError } = await supabase.from('users').insert([
            {
                auth_user_id: data.user.id,
                username,
                email
            },
        ])

        if (insertError) {
            console.error('loi khi dang ki user', insertError.message)
            return {
                success: false,
                error: 'Tao tai khoan thanh cong nhung khong luu duoc ho so user',
            }
        }

        return {
            success: true,
            user: data.user,
            error: null,
        }
    },

    login: async (emailUser, password) => {
        const email = emailUser.trim().toLowerCase()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { success: false, error: error.message }
        }

        const user = data.user

        if (!user.confirmed_at) {
            return { success: false, error: 'mail chua xac thuc' }
        }

        const { data: users, error: errRole } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

        if (errRole) {
            return { success: false, error: errRole.message }
        }

        return {
            success: true,
            userFull: {
                ...user,
                ...users,
            },
        }
    },

    logout: async () => {
        return { success: true }
    },
}

module.exports = authModel
