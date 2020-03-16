const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');

const START_PAGE_URL = "http://localhost:8080/";
const  FIRST_FORM_SELECTOR ="#Title";
(async ()=>{
    let browser = await puppeteer.launch({
        headless: false,
        slowMo: 150

    });
page = await browser.newPage();
await installMouseHelper(page);
await page.goto(START_PAGE_URL);
await page.waitForSelector(FIRST_FORM_SELECTOR);
await page.click(FIRST_FORM_SELECTOR);
await page.keyboard.type("test title");
await page.keyboard.press("Tab");
await page.keyboard.type("1202");
await page.keyboard.press("Tab");
await page.keyboard.type("dvd");
await page.keyboard.press("Tab");
await page.keyboard.type("actor1");
await page.keyboard.press("Tab");
await page.keyboard.press("Space");

await page.keyboard.down('Shift');
await page.keyboard.press("Tab");
await page.keyboard.up('Shift');
await page.keyboard.type("actor2");
await page.keyboard.press("Tab");
await page.keyboard.press("Space");
await page.keyboard.press("Tab");
await page.keyboard.press("Space");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.type("test");
await page.keyboard.press("End");
await page.waitFor(1000);
const [button] = await page.$x("//td[contains(., 'test')]");
if (button) {
    await button.click();
}
await page.waitFor(1000);
await page.keyboard.down('Shift');
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.up('Shift');
await page.keyboard.type("1999");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Space");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Space");
await page.keyboard.press("End");
await page.waitFor(1000);
const [button2] = await page.$x("//button[contains(., 'delete')]");
await page.waitFor(1000);
if (button2) {
    await button2.click();
    await page.waitFor(1000);
}
await page.focus("#SearchByTitle")
await page.keyboard.press("Delete");
await page.keyboard.press("Tab");
await page.keyboard.type("paul");
await page.keyboard.press("Tab");
await page.keyboard.press("Space");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Space");
await page.keyboard.press("Tab");



})()