const Telegraf = require('telegraf')
const khayyam = require('./khayyam.js')
const messages = require('./messages.js')


exports.saaghia = (event, context, callback) => {
  
  console.log(JSON.stringify(event))

  if (event.source == 'aws.events') {
    console.log('I feel warm.')
    callback(null, 'I feel warm.')
  }

  if (!process.env.SAAGHIBOT_TOKEN) {
      console.error('SAAGHIBOT_TOKEN environment variable not defined.')
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: 'SAAGHIBOT_TOKEN environment variable not defined.',
        })
      })
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

  bot.handleUpdate(JSON.parse(event.body))

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
    })
  })
}
