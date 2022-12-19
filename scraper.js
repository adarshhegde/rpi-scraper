import { events } from './events.js';
import * as jsdom from "jsdom";

async function CheckSilverElectronicsStock(LINK) {
    const response = await fetch(LINK);
    const body = await response.text();
    try {
        const dom = new jsdom.JSDOM(body.replace(/<style(\s|>).*?<\/style>/gi, ''), { url: "https://silverlineelectronics.in" });
        const document = dom.window.document;
        return (!!document.querySelector("#product-add-to-cart") ? true : false);
    } catch (err) {
        console.log(err);
        return false;
    }
}


async function CheckRoboCrazeStock(LINK) {

    const response = await fetch(LINK);
    const body = await response.text();

    try {

        const dom = new jsdom.JSDOM(body.replace(/<style(\s|>).*?<\/style>/gi, ''), { url: "https://robocraze.com" });
        const document = dom.window.document;
        return !(document.querySelector(".btn.product-form__cart-submit.btn--secondary-accent span").textContent.trim() === "Sold out");
    } catch (err) {
        console.log(err);
        return false;
    }
}


async function CheckThingBitsStock(LINK) {

    const response = await fetch(LINK);
    const body = await response.text();

    try {

        const dom = new jsdom.JSDOM(body.replace(/<style(\s|>).*?<\/style>/gi, ''), { url: "https://robocraze.com" });
        const document = dom.window.document;
        return (!!document.querySelector("#stock_notify_button") ? false : !!document.querySelector("#add-to-cart-button"));
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function CheckRobuStock(LINK) {

    const response = await fetch(LINK);
    const body = await response.text();
    try {
        const dom = new jsdom.JSDOM(body.replace(/<style(\s|>).*?<\/style>/gi, ''), { url: "https://robu.in" });
        const document = dom.window.document;
        return (document.querySelector(".electro-stock-availability").textContent.trim() === "In stock");
    } catch (err) {
        console.log(err);
        return false;
    }
}
export async function startScraper() {

    const LINKS = [
        { link: "https://www.silverlineelectronics.in/collections/raspberry-pi-4/products/raspberry-pi-4-model-b-8gb-silverline-india", name: "silverline" , func : CheckSilverElectronicsStock},
        { link: "https://robocraze.com/products/raspberry-pi-4-model-b-8-gb-ram?src=raspberrypi", name: "robocraze" , func : CheckRoboCrazeStock},
        { link: "https://www.thingbits.in/products/raspberry-pi-4-model-b-8-gb-ram?src=raspberrypi?src=raspberrypi", name: "thingbits" , func : CheckThingBitsStock},
        { link: "https://robu.in/product/raspberry-pi-4-model-b-with-8-gb-ram/?src=raspberrypi", name: "robu" , func : CheckRobuStock},
    ]

    const results = [];
    for(let site of LINKS) {
        results.push({name:site.name, link:site.link, available:await site.func(site.link)});
    }
    console.log(results);
    for(let res of results) {
        if(!res.available) {
            events.emit("available", res);
        }
    }
}

let timer_id;

events.on("change_state", (state) => {
    console.log(state);
    if(state) {
        startScraper();
        timer_id = setInterval(startScraper, 1000 * 60 * 10);
    } else {
        clearInterval(timer_id);
    }
})