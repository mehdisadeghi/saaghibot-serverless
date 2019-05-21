const Telegraf = require('telegraf')
const khayyam = require('./khayyam.js')
const messages = require('./messages.js')


module.exports.saaghia = async (event) => {

  if (!process.env.SAAGHIBOT_TOKEN) {
      console.error('SAAGHIBOT_TOKEN environment variable not defined.')
      return {statusCode: 500}
  }

  const bot = new Telegraf(process.env.SAAGHIBOT_TOKEN)
  
  bot.start((ctx) => ctx.replyWithMarkdown(messages.help))
  bot.help((ctx) => ctx.replyWithMarkdown(messages.help))

  bot.on('sticker', (ctx) => ctx.reply('👍'))

  bot.on('message', (ctx) => {
    ctx.replyWithMarkdown(khayyam.findOne(ctx.message.text) || messages.nihility)
  })
  
  bot.on('inline_query', (ctx) => {
    ctx.answerInlineQuery(khayyam.process_query(ctx.inlineQuery.query).slice(0, 50))
  })

  await bot.handleUpdate(JSON.parse(event.body))

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  }
}
