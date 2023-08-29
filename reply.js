const _ = require("underscore");
const { filterByWordList } = require("./filter");
const config = require("./config");

const LOG_PREFIX = "reply ";

async function reply(msg, results) {
  if (config.debug) {
    config.logger.info(LOG_PREFIX + `replying ${JSON.stringify(results)}`);
  }
  if (config.states.disableSaying) {
    config.logger.info(
      LOG_PREFIX + "because of setting, I will not say anything"
    );
    return;
  }

  if (results.length === 0) return;
  results = _.flatten(results);
  const updateResult = async () => {
    let newResults = [];
    for (let result of results) {
      if (result instanceof Function) {
        newResults.push(await result());
      } else {
        newResults.push(result);
      }
    }
    return newResults;
  };
  results = await updateResult();
  results = _.map(results, (result) => filterByWordList(result));

  for (let result of results) {
    if (result) {
      msg.say(result);
    }
  }
}

module.exports = reply;
