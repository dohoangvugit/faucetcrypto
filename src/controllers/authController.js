const authModel = require('../models/authModel')

const Authcontroller = {
    login(req, res) {
        res.render('auth', { isLogin: true })
    },

    async loginSubmit(req, res) {
        try {
            const { email, password } = req.body
            const { success, userFull, error } = await authModel.login(email, password)

            console.log('LOGIN RESULT:', { success, userFull, error })

            if (error) {
                if (error === 'mail chua xac thuc') {
                    return res.status(401).json({
                        message: 'Email chua xac thuc',
                    })
                }

                return res.status(400).json({
                    message: 'Dang nhap that bai: sai email hoac mat khau',
                    error,
                })
            }

            if (success) {
                req.session.user = userFull
                // console.log('User session:', req.session.user)

                return req.session.save(() => {
                    if (userFull.role === 'client') {
                        return res.redirect('/client/tasks')
                    }

                    return res.redirect('/admin/task')
                })
            }
        } catch (err) {
            console.error(err.message)
            return res.status(500).json({
                message: 'Co loi xay ra',
                error: err.message,
            })
        }
    },

    register(req, res) {
        res.render('auth', { isLogin: false })
    },

    async registerSubmit(req, res) {
        try {
            const { email, password, username } = req.body
            const { success, user, error } = await authModel.register(email, username, password)

            if (error) {
                return res.status(400).json({
                    message: 'Dang ky that bai',
                    error,
                })
            }

            if (success) {
                return res.status(200).json({
                    message: 'Dang ky thanh cong. Vui long kiem tra email de xac nhan.',
                    user,
                })
            }

            return res.status(400).json({
                message: 'Dang ky that bai. Vui long thu lai.',
            })
        } catch (err) {
            console.error(err.message)
            return res.status(500).json({
                message: 'Co loi xay ra',
                error: err.message,
            })
        }
    },

    async logout(req, res) {
        try {
            console.log('[logout] start')
            await authModel.logout()

            req.session.destroy((err) => {
                if (err) {
                    console.error('loi dang xuat', err)
                    return res.status(500).json({
                        message: 'Loi dang xuat',
                        error: err.message,
                    })
                }

                console.log('[logout] session destroyed')
                res.clearCookie('connect.sid')
                console.log('[logout] redirect to /')
                return res.redirect('/')
            })
        } catch (err) {
            console.error('loi dang xuat', err)
            return res.status(500).json({
                message: 'Loi dang xuat',
                error: err.message,
            })
        }
    },
}

module.exports = Authcontroller
