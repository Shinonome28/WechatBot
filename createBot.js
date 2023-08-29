const { WechatyBuilder, ScanStatus, log } = require('wechaty')
const qrTerminal = require('qrcode-terminal')
const config = require("./config")

function onScan(qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrTerminal.generate(qrcode, { small: true })
        const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
        config.logger.info('onScan:', qrcodeImageUrl, ScanStatus[status], status)
    } else {
        config.logger.info(`onScan: ${ScanStatus[status]}`)
    }
}

function onLogin(user) {
    config.logger.info(`"${user}" 已经登入微信`)
}

const bot = WechatyBuilder.build({
    name: "ShinonomeWechatBot",
    puppet: 'wechaty-puppet-wechat',
    puppetOptions: {
        uos: true,
    },
})

bot.on('scan', onScan)
bot.on('login', onLogin)

const startBot = () => bot
    .start()
    .then(() => config.logger.info('准备登录到微信'))

module.exports = {
    startBot,
    bot
}