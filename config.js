require("dotenv").config();
const fs = require("fs/promises");
const { Mint } = require("mint-filter");
const winston = require("winston");

const config = {
  botName: "猫猫bot",
  opName: "東雲夕方 Official",
  testGroupName: "猫猫bot测试群",
  states: {
    disableBingChat: true,
    disableSaying: true,
    disableDebugConsole: true,
    disableSetu: true,
    setuBotEnableR18: false,
  },
  bingAIChatKeyword: "ai",
  setuCategoryRegexp: /我要看(.*)的色图/,

  autoReplyEnableGroupList: ["猫猫bot测试群", "W.C.T", "佬社批仙人理发店"],
  errorMessage: "内部错误",
  staticResource: {},
  logger: null,
  debug: process.env["DEBUG"],
};

config.resetAllStates = () => {
  config.states.disableBingChat = false;
  config.states.disableDebugConsole = false;
  config.states.disableSaying = false;
  config.states.disableSetu = false;
  config.logger.info("all features has been enabled");
};

config.atPrefix = "@" + config.botName;

function wrapValueToFuntion(obj) {
  for (let [key, value] of Object.entries(obj)) {
    obj[key] = () => value;
  }
}

async function loadAllStaticResources() {
  // 敏感词库来源 https://github.com/cjh0613/tencent-sensitive-words/blob/main/sensitive_words_lines.txt
  // 有删改

  config.staticResource.sensitiveWordFilter = new Mint(
    (await fs.readFile("sensitive_words_lines.txt")).toString().split("\n")
  );

  config.staticResource.groupAutoReplyRules = JSON.parse(
    await fs.readFile("./rules/groupAutoReplyRules.json")
  );
  wrapValueToFuntion(config.staticResource.groupAutoReplyRules);
  config.staticResource.beingAtReplyRules = JSON.parse(
    await fs.readFile("./rules/beingAtAutoReplyRules.json")
  );
  wrapValueToFuntion(config.staticResource.beingAtReplyRules);

  config.staticResource.setuConfig = JSON.parse(
    await fs.readFile("./rules/setuConfig.json")
  );
}

function initLogger() {
  const myFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level} ${message}`;
  });

  config.logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss",
      }),
      winston.format.colorize({ level: true }),
      myFormat
    ),
    transports: [
      new winston.transports.Console(),
      //new winston.transports.File({ filename: ERROR_LOG_FILE, level: 'error' }),
      //new winston.transports.File({ filename: COMBINED_LOG_FILE })
    ],
  });
}

config.configAll = async () => {
  await loadAllStaticResources();
  initLogger();
};

module.exports = config;
