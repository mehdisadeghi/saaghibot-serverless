'use strict'

const khayyam = require('./khayyam.js')
const Telegraf = require('telegraf')

const helpMessage = `به ساقی‌بات خوش آمدید!

ساقی‌بات یک روبات تلگرام است. اسم خودمانی‌اش ساقی است. کارش اینست که بزم و دل ما را با یک دو بیتی از خیام شاد کند.

ساده‌ترین راه استفاده از ساقی چت کردن با اوست. هر کلمه‌ای که برایش بنویسید، او برایتان یک رباعی از خیام پیدا می‌کند که حاوی آن کلمه باشد.

اما بهترین راه استفاده از ساقی یادکرد (مِنشِن) کردن او در گروه‌هاست.
به محض اینکه ساقی را یاد کنید، او یک رباعی اتفاقی نمایش می‌دهد. اگر کلماتی پس از نامش بنویسید، او یک رباعی با آن کلمات پیشنهاد می‌کند. مثال:
@SaaghiBot زلف
مثالا بالا یک یا چند رباعی لیست می‌کند تا یکی را از میانشان انتخاب کنید.

از این گذشته ساقی [اوپن‌سورس](https://github.com/mehdisadeghi/SaaghiBot) است. [اینجا](https://mehdix.ir/saaghibot-released.html) درباره‌اش نوشته‌ام.

اگر به مدد ساقی نیاز شد /start و /help را اجرا کنید.

خوش باشید
ساقی
.`

const notFoundMessage = `گفتند یافت می‌نشود جسته‌ایم ما
گفت آن کو *یافت می‌نشود* آنم آرزوست
.`

module.exports.saaghia = async (event) => {
  if (!process.env.SAAGHIBOT_TOKEN) {
      console.error('SAAGHIBOT_TOKEN environment variable not defined.')
      return {statusCode: 500}
  }

  let msg = JSON.parse(event.body).message
  let txt = notFoundMessage

  let robayis = khayyam.process_query(msg.text)
  if (robayis && robayis.length > 0) {
    let index = khayyam.getRandomInt(0, robayis.length)
    txt = robayis[index].message_text
  }

  const bot = new Telegraf(process.env.SAAGHIBOT_TOKEN)
  bot.start((ctx) => ctx.replyWithMarkdown(helpMessage))
  bot.help((ctx) => ctx.replyWithMarkdown(helpMessage))
  bot.on('sticker', (ctx) => ctx.reply('👍'))
  bot.on('message', (ctx) => ctx.replyWithMarkdown(txt))  
  bot.on('inline_query', async (ctx) => ctx.answerInlineQuery(
    await khayyam.process_query(ctx.inlineQuery.query).slice(0, 50)))

  await bot.handleUpdate(JSON.parse(event.body))

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  }
}
