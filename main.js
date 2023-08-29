const config = require("./config");
const { bot, startBot } = require("./createBot");
const autoReply = require("./apps/autoReply");
const echoFriend = require("./apps/echoFriend");
const logAllMessage = require("./apps/logAllMessage");
const echoGroup = require("./apps/echoGroup");
const {
  chainMessageHandlersSequence,
  chainMessageHandlersOnlyOne,
} = require("./chaninMessageHandlers");
const reply = require("./reply");
const debugConsole = require("./apps/debugConsole");
const setu = require("./apps/setu");

async function main() {
  // a workaroud for importing ESM
  const { getBingChatWhenBeingAt } = await import("./apps/bingChat.mjs");

  await config.configAll();

  setTimeout(() => {
    config.resetAllStates()
  }, 60 * 1000);

  const chainOfDebugHandlers = chainMessageHandlersSequence([
    logAllMessage,
    echoFriend(config.opName),
    echoGroup(config.testGroupName),
  ]);

  const chainOfCommonAutoReplyHandlers = chainMessageHandlersSequence([
    autoReply(
      config.autoReplyEnableGroupList,
      {
        atMode: true,
        groupChatMode: true,
      },
      config.staticResource.beingAtReplyRules
    ),
    autoReply(
      config.autoReplyEnableGroupList,
      {
        atMode: false,
        groupChatMode: true,
      },
      config.staticResource.groupAutoReplyRules
    ),
  ]);

  const chainOfFinallConfiguration = chainMessageHandlersSequence([
    chainMessageHandlersOnlyOne([
      debugConsole(config.opName),
      setu(config.staticResource.setuConfig),
      chainOfCommonAutoReplyHandlers,
      getBingChatWhenBeingAt,
    ]),
    //chainOfDebugHandlers,
  ]);

  bot.on("message", async (msg) => {
    await reply(msg, await chainOfFinallConfiguration(msg));
  });

  startBot();
}

main();
