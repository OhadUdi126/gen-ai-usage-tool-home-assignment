const OpenAI = require("openai");
require("dotenv").config();

console.log('process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL:'https://api.aim.security/fw/v1/proxy/openai'
});

module.exports = openai;
