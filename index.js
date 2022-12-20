import './config.js';
import { events } from './events.js';
import {
    setTimeout,
  } from 'timers/promises';
import bot from './bot.js';
import { startScraper } from './scraper.js';
import express from 'express';

const app = express();

app.get("/", (req, res) => res.send("alive"));

async function main() {

    bot.launch();
    app.listen(80, () => console.log("server running"));
    
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

main();