import { Telegraf } from 'telegraf';
import { events } from './events.js';
console.log(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);

const CHAT_ID = process.env.CHAT_ID;

let ACTIVE = false;

events.on("available", (site) => {

    bot.telegram.sendMessage(CHAT_ID, `available on ${site.link}`);
    
})

bot.command("toggle", (ctx) => {
    console.log(ctx.chat.id)

    if(ctx.chat.id == CHAT_ID) {
        if (ACTIVE) {
            ctx.sendMessage("turned off");
        } else {
            ctx.sendMessage("turned on");
        }
        ACTIVE = !ACTIVE;
        events.emit("change_state", ACTIVE);
    }
})

export default bot;
