const puppeteer = require('puppeteer')
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

let browser = null;
(async function () {
    browser = await puppeteer.launch({
        args: [ '--no-sandbox', '--disable-setuid-sandbox',],
        headless: true,
    });
})();

const client = new Client();
const numbersToNotify = [
    {
        number: '558594092188',
        name: 'Marcos Vinicius',
        product: 'Creatina 100g Creapure Growth Supplements',
        url: 'https://www.gsuplementos.com.br/creatina-100g-creapure-growth-supplements-p985927'
    },
    {
        number: '558594092188',
        name: 'Marcos Vinicius',
        product: 'Creatina 250g Monohidratada Growth Supplements',
        url: 'https://www.gsuplementos.com.br/creatina-monohidratada-250gr-growth-supplements-p985931'
    },
    {
        number: '558594092188',
        name: 'Marcos Vinicius',
        product: 'Creatina 250g Creapure Growth Supplements',
        url: 'https://www.gsuplementos.com.br/creatina-250g-creapure-growth-supplements-p985824'
    },
    {
        number: '558594092188',
        name: 'Marcos Vinicius',
        product: 'Creatina 100g Monohidratada Growth Supplements',
        url: 'https://www.gsuplementos.com.br/creatina-monohidratada-100gr-growth-supplements-p985930'
    },
];

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    setInterval(() => {
        start();
    }, 300000);
});

async function start() {
    console.info("vai iniciar")
    for (const item of numbersToNotify) {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({width: 400, height: 1024});
        console.info("verificando o item: " + item.product);
        await page.goto(item.url), {
            waitUntil: 'load',
            timeout: 0
        };
        await checkIsAvaiable(page, item);
    }
}

async function checkIsAvaiable(page, item) {
    console.info("Acessou a pagina do produto: " + item.product);

    const searchResultSelectorDisponivel = '.boxFlutuante-botaoComprar';
    await page.waitForSelector(searchResultSelectorDisponivel)
        .then(async () => {
            await client.sendMessage(item.number + '@c.us', `Olá ${item.name}! O produto ${item.product} está disponível! Acesse o link: ${item.url}`)
        })
        .catch(error => console.log('Produto indisponível!', error));
}

client.initialize();