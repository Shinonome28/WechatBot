// supprot both String and Array<String>
function isIncludeKeyword(key, text) {
    if (Array.isArray(key)) {
        let hasKeyword = false
        for (let item of key) {
            if (text.includes(item)) {
                hasKeyword = true
                break
            }
        }
        return hasKeyword
    }
    else {
        return text.includes(key)
    }
}

module.exports = {
    isIncludeKeyword
}