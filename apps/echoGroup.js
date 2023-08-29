async function echoGroup(name) {
    return async function (msg) {
        let topic = ""
        if (msg.room() && !msg.self()) {
            topic = await msg.room().topic()
        }
        else {
            return
        }
        if (topic.includes(name)) {
            return `群聊 ${topic} 发送者：${msg.talker().name()} 内容：${msg.text()} 时间：${msg.date()}`
        }
    }
}

module.exports = echoGroup