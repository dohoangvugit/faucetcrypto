const authModel = require('../models/authModel')

const Authcontroller = {
    login (req, res){
        res.render('auth', { isLogin: true })
    },

    async loginSubmit (req, res) {
        try {
            const { email, password } = req.body
            const { success, user, err } = await authModel.login(email, password)
            const isVerified = user?.raw_user_meta_data?.email_verified ?? false

            if (!isVerified) {
                return res.status(401).json({
                    message: 'Email chưa xác thực'
                })
            }           
            if (err) {
                return res.status(400).json({
                    message: 'Đăng nhập thất bại',
                    error: err?.message
                })
            }                    

            if (success) {
                return res.status(200).json({
                    message: 'Đăng nhập thành công',
                    user
                })
            }
        } catch (err) {
            console.error(err.message)
            return res.status(500).json({
                message: 'Có lỗi xảy ra',
                error: err.message
            })
        }
    },

    register (req, res){
        res.render('auth', { isLogin: false })
    },

    async registerSubmit(req, res){
        try {
            const { email, password, username } = req.body
            const { success, user, err } = await authModel.register(email, username, password)

            if (err) {
                return res.status(400).json({
                    message: 'Đăng ký thất bại',
                    error: err.message
                })
            }

            if (success) {
                return res.status(200).json({
                    message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.',
                    user
                })
            }

            return res.status(400).json({
                message: 'Đăng ký thất bại. Vui lòng thử lại.'
            })

        } catch (err) {
            console.error(err.message)
            return res.status(500).json({
                message: 'Có lỗi xảy ra',
                error: err.message
            })
        }
    },

    async logout(req, res){
        try {
            const { success, err } = await authModel.logout()

            if (err) {
                return res.status(400).json({
                    message: 'Đăng xuất thất bại',
                    error: err.message
                })
            }

            if (success) {
                return res.status(200).json({
                    message: 'Đăng xuất thành công'
                })
            }

        } catch (err) {
            console.error('lỗi đăng xuất', err)
            return res.status(500).json({
                message: 'Lỗi đăng xuất',
                error: err.message
            })
        }
    }
}

module.exports = Authcontroller