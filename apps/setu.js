const config = require("../config");
const axios = require("axios");
const { FileBox } = require("file-box");
const { HttpsProxyAgent } = require('https-proxy-agent')

const setuAPI = axios.create({
  baseURL: "https://setu.yuban10703.xyz/setu",
  timeout: 30 * 1000,
});

async function getSetu(params) {
  return setuAPI.post("/", {
    r18: config.states.setuBotEnableR18? "1" : "0",
    num: "1",
    replace_url: "https://i.pixiv.cat/",
    tags: [],
    ...params,
  });
}

async function constructMessage(apiresult) {
  const artworkTitle = apiresult["artwork"]["title"];
  const authorName = apiresult["author"]["name"];
  const url = apiresult["urls"]["medium"];
  const downloadImage = await axios({
    url,
    method: 'GET',
    responseType: "arraybuffer",
    timeout: 30 * 1000,
    proxy: false,
    httpsAgent: new HttpsProxyAgent(process.env["HTTP_PROXY"])
  })
  const image = FileBox.fromBase64(downloadImage.data.toString('base64'), "a.png")
  return [`是画师 ${authorName} 的作品 ${artworkTitle}喵`, image];
}

function setu(setuConfig) {
  return async (msg) => {
    if (config.states.disableSetu || msg.self()) {
      return;
    }
    let text = msg.text();
    if (!text.includes(config.atPrefix)) {
      return;
    }
    text = text.replace(config.atPrefix, "");
    const matchResult = text.match(config.setuCategoryRegexp);
    if (!matchResult) {
      return;
    }
    let [wholeMatch, category] = matchResult;
    category = category.trim()
    config.logger.info(
      "setu " +
        `dealing with request ${text}, regexp matching result ${wholeMatch}`
    );
    if (wholeMatch && category) {
      let categoryConfig = null
      if (Object.keys(setuConfig).indexOf(category) !== -1) {
        categoryConfig = setuConfig[category];
      }
      else {
        categoryConfig = {
          reply: "",
          tags: [
            category
          ]
        }
      }
      try {
        const apiReponse = await getSetu(categoryConfig.apiparams);
        if (apiReponse.data.count < 1) {
          return "没有喵"
        }
        const apiResult = apiReponse.data.data[0];
        const rawURL = apiResult["urls"]["original"]
        return [categoryConfig.reply, `高清图片地址 ${rawURL}`].concat(await constructMessage(apiResult));
      } catch (e) {
        config.logger.error("setu " + `发生错误：${e.message}`);
        return config.errorMessage;
      }
    }
  };
}

module.exports = setu;
