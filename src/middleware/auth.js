function checkLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    next()
}

function checkAdmin(req, res, next) {
    const user = req.session.user
    if (!user || user.role !== 'admin') {
        return res.status(403).send('Bạn không có quyền truy cập')
    }
    next()
}

function checkClient(req, res, next) {
    const user = req.session.user
    if (!user || user.role !== 'client') {
        return res.status(403).send('Bạn không có quyền truy cập')
    }
    next()
}

module.exports = { checkLogin, checkAdmin, checkClient }