const supabase = require('../config/db')

const authModel = {
    register: async (email, username, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        })

        if (error) {
            return { error: error.message }
        }

        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    auth_user_id: data.user.id,
                    username,
                    email,
                    created_at: new Date(),
                },
            ])

        if (insertError) {
            return { error: insertError.message }
        }

        return {
            success: true,
            user: data.user,
            err: null,
        }
    },

    login: async (email, password) => {
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
            .select('role,username,balance,auth_user_id')
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
        const { error } = await supabase.auth.signOut()

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true }
    },
}

module.exports = authModel
