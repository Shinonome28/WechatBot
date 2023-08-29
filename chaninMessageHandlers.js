const _ = require('underscore')

function chainMessageHandlersSequence(handlers) {
    return async function (msg) {
        let replys = []
        for (let handler of handlers) {
            const result = await handler(msg)
            if (result) {
                replys.push(result)
            }
        }
        return replys
    }
}

function chainMessageHandlersOnlyOne(handlers) {
    return async function (msg) {
        let reply = ""
        for (let handler of handlers) {
            const result = await handler(msg)
            if (result && !(Array.isArray(result) && _.flatten(result).length === 0)) {
                reply = result
                break
            }
        }
        return reply
    }
}

module.exports = {
    chainMessageHandlersSequence,
    chainMessageHandlersOnlyOne
}