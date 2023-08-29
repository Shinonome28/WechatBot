const _ = require('underscore')
const config = require('../config')
const { isIncludeKeyword } = require("../utils")

const LOG_PREFIX = "autoReply "

function autoReply(name, modes, rules) {
    const { atMode, groupChatMode } = modes
    return async function (msg) {
        let roomTopic = ""
        if (groupChatMode && msg.room()) {
            roomTopic = await msg.room().topic()
        }
        // 群聊模式
        if (!(groupChatMode && msg.room() && !msg.self() && isIncludeKeyword(name, roomTopic))) {
            // 私聊模式（继续判断）
            if (!(!groupChatMode && !msg.self() && isIncludeKeyword(name, msg.talker().name())))
                return;
        }
        let text = msg.text().trim()
        const atPrefix = "@" + config.botName
        if (atMode && !text.startsWith(atPrefix)) {
            return
        }
        // at模式和非at模式是互斥的
        if (!atMode && text.startsWith(atPrefix)) {
            return
        }
        if (atMode) {
            text = text.substring(atPrefix.length).trim()
        }

        let replys = []
        for (let [key, value] of Object.entries(rules)) {
            if (text.includes(key)) {
                const result = await value(text)
                if (Array.isArray(result)) {
                    replys.push(_.sample(result))
                }
                else {
                    replys.push(result)
                }
            }
        }

        if (atMode && replys.length === 0 && config.defaultAtReply) {
            replys.push(await config.defaultAtReply(text))
        }

        if (replys.length === 0)
            return null

        return replys
    }
}


module.exports = autoReply