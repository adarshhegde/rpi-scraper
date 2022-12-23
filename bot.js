import { Telegraf } from 'telegraf';
import { events } from './events.js';
import { addUser, getUsers, removeUser } from './store.js';
console.log(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);

const CHAT_ID = process.env.CHAT_ID;

let ACTIVE = await getUsers();

let SCRAPING = false;


events.on("available", (site) => {
    for(let chat_id of ACTIVE){
        bot.telegram.sendMessage(chat_id, `available on ${site.link}`);
    }
})

bot.command("watch", async (ctx) => {
    ACTIVE = await getUsers();
    
    if(ACTIVE.indexOf(ctx.chat.id) != -1) {
        removeUser(ctx.chat.id);
        ctx.reply("Unsubscribed from updates.");
    } else {
        addUser(ctx.chat.id);
        ctx.reply("Subscribed to updates.");
    }
});

bot.command("scraping", (ctx) => {
    if(ctx.chat.id == CHAT_ID) {
        SCRAPING = !SCRAPING;
        events.emit("change_state", SCRAPING);
        ctx.reply(SCRAPING ? "Turned on." : "Turned off");
    }
})

bot.command("status",(ctx) => {
    events.emit("get_status");
    events.once("status", (data) => {
        if(data)
        ctx.reply("last checked at " + new Date(data).toString());
        else 
        ctx.reply("inactive")
    })
})

export default bot;
