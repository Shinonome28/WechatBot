const config = require("../config")

const LOG_PREFIX = "logAllMessage "

async function logAllMessage(msg) {
    if (msg.room()) {
        const room = msg.room()
        const topic = await room.topic()
        config.logger.info(LOG_PREFIX + `群聊 "${topic}" 发送了信息，发送人是 "${msg.talker().name()}" ，内容是 "${msg.text()}" `)
    }
    else {
        config.logger.info(LOG_PREFIX + `收到信息，发送人是 "${msg.talker().name()}" ，内容是 "${msg.text()}"，发给"${msg.to().name()}" `)
    }
}

module.exports = logAllMessage