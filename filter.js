const config = require('./config')
const _ = require("underscore")

// 返回过滤后的内容
function filterByWordList(result) {
    if (result instanceof String)
        return config.staticResource.sensitiveWordFilter.filter(result).text
    else
        return result
}

module.exports = {
    filterByWordList
}