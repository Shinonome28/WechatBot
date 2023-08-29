function echoFriend(name) {
    return function (msg) {
        if (!msg.room() && !msg.self() && msg.talker().name().includes(name)) {
            return `发送者：${msg.talker().name()} 内容：${msg.text()} 时间：${msg.date()}`
        }
    }
}

module.exports = echoFriend