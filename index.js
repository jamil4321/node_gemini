const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client,LocalAuth, MessageMedia  } = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');
const qrFile = require('qrcode')


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // headless:false,

        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        //     // 
    }
});
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("Your_API_KEY");

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chat = model.startChat({
    generationConfig: {
        maxOutputTokens: 100,
    },
});

client.on('ready', () => {
    console.log('Client is ready!');
    // run();
});

client.on('message', async msg => {
    console.log("message",msg)
    try{
    const result = await chat.sendMessage(msg.body);
    const response = await result.response;
    const text = response.text();
    msg.reply(text);}
    catch(e){
        console.log(e)
    }
});

client.initialize();