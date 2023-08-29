const config = require("../config");

const LOG_PREFIX = "debugConsole ";

const rules = {
  "debug:disable-aichat": () => {
    config.states.disableBingChat = true;
    return "AI聊天已被成功禁用喵";
  },
  "debug:enable-aichat": () => {
    config.states.disableBingChat = false;
    return "AI聊天已被开启喵";
  },
  "debug:enable-r18": () => {
    config.states.setuBotEnableR18 = true;
    return "R18模式已开启"
  },
  "debug:disable-r18": () => {
    config.states.setuBotEnableR18 = false;
    return "R18模式已关闭"
  }
};

function debugConsole(op) {
  return function (msg) {
    if (config.states.disableDebugConsole) {
      return
    }
    if (!msg.self() && msg.talker().name().trim() === op.trim()) {
      const text = msg.text().trim();
      if (text.startsWith("@" + config.botName)) {
        for (let [key, value] of Object.entries(rules)) {
          if (text.includes(key)) {
            config.logger.log('warn',LOG_PREFIX + "成功触发控制台命令 " + key);
            return value();
          }
        }
      }
    }
  };
}

module.exports = debugConsole;
