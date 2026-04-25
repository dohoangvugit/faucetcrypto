const supabase = require('../config/db')

const authModel = {
    register: async (email, username, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedUsername = username.trim()

        const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select('id')
            .eq('email', normalizedEmail)
            .maybeSingle()

        if (existingUserError) {
            return { success: false, error: existingUserError.message }
        }

        if (existingUser) {
            return { success: false, error: 'Email da ton tai' }
        }

        const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
                data: {
                    username: normalizedUsername,
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
                username: normalizedUsername,
                email: normalizedEmail,
                created_at: new Date(),
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

    login: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()

        const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
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
            .select('role,username,balance,auth_user_id')
            .eq('email', normalizedEmail)
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
