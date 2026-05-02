const userModel = require('../models/userModel')
const wallet = require('../config/wallet')
const {ethers} = require('ethers')

const withdrawController = {
    async getWithdraw (req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'vui long dang nhap' })
            }
            const user = req.session.user
            return res.render('client/withdraw', { layout: 'client' ,user })
        } catch (err) {
            console.error('loi', err)
            res.status(500).json({ error: 'loi', message: err.message })
        }
    },

    async postWithdraw (req , res) {
        try{
            if (!req.session.user) {
                return res.status(401).json({ error: 'vui long dang nhap' })
            }
            const user = req.session.user
            const { amount: amountStr, wallet: userWallet } = req.body
            const amount = parseFloat(amountStr)

            if (!amount || !userWallet) {
                return res.status(400).json({ error: 'nhap thieu thong tin' })
            }

            if( amount < 0.001){
                return res.status(400).json({ error: 'so du khong hop le, so tien rut phai lon hon hoac bang 0.001' })
            }

            if (amount > user.balance) {
                return res.status(400).json({ error: 'so du ko du' })
            }

            const newBalance = user.balance - amount

            await userModel.updateUser(user.id, { balance: newBalance })

            req.session.user.balance = newBalance
            req.session.save()

            try{
                const request = {
                    to: userWallet,
                    value: ethers.parseEther(amount.toString())
                }

                const response = await wallet.sendTransaction(request)

                const receipt = await response.wait()

                if (receipt.status === 1) {
                    return res.status(200).json({ message: 'Rút tiền thành công', txHash: response.hash, balance: newBalance })
                } else {
                    console.error('giao dich that bai', response.hash)
                    return res.status(500).json({ error: 'giao dich that bai', txHash: response.hash })
                }

            } catch (err) {
                console.error('loi giao dich:', err)
                return res.status(500).json({ error: 'giao dich that bai', message: err.message })
            }
            

        } catch (err) {
            console.error('loi rut tien', err)
            res.status(500).json({ error: 'loi rut tien', message: err.message })
        }

    }
}

module.exports = withdrawController
