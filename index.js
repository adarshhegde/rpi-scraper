import './config.js';
import { events } from './events.js';
import {
    setTimeout,
  } from 'timers/promises';
import bot from './bot.js';
import { startScraper } from './scraper.js';

async function main() {

    bot.launch();
  
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

main();