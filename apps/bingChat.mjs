import config from "../config.js"
import { BingAIClient } from "@waylaidwanderer/chatgpt-api"

const LOG_PREFIX = "bingChat "

const options = {
    // "_U" cookie from bing.com
    userToken: process.env["BING_COOKIE"],
    // A proxy string like "http://<ip>:<port>"
    proxy: process.env["HTTP_PROXY"],
}

const sydneyAIClient = new BingAIClient(options)

const getJailbreakResponse = async (msg) => (await sydneyAIClient.sendMessage(msg, {
    jailbreakConversationId: true,
})).response.replace("Sydney", config.botName);

export async function getBingChatWhenBeingAt(msg) {
    if (msg.self() || !msg.text().includes(config.bingAIChatKeyword) || config.states.disableBingChat) {
        return
    }
    let text = msg.text().replace(config.bingAIChatKeyword, "").trim()
    const atPrefix = "@" + config.botName
    if (text.startsWith(atPrefix)) {
        text = text.substring(atPrefix.length).trim()
        config.logger.info(LOG_PREFIX + `trying to get BingChat Response for text "${text}"`)
        try {
            const bingchatResponse = await getJailbreakResponse(text)
            return `@${msg.talker().name()} ` + bingchatResponse
        }
        catch (e) {
            config.logger.info(LOG_PREFIX + `error: ${e.message}`)
            return `@${msg.talker().name()} ` + config.errorMessage;
        }
    }
}