const { topGG, botinfo } = require("../../Configs/main.json");
const express = require("express");
const Topgg = require("@top-gg/sdk");
const fetch = require("node-fetch");

const app = express();

const webhook = new Topgg.Webhook("topggauth123");

app.post('/dblwebhook', webhook.listener(vote => {
    console.log("User with id" + vote.user + " just voted!");
    let value = JSON.stringify({
        embeds: [
            {
                title: `${botinfo.name} | New Vote!`,
                description: `<@${vote.user}> has just voted for \`${botinfo.name}\`!`,
                color: "GREEN"
            }   
        ]
    });
    fetch(topGG.webhook, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: value
    }).catch(e => console.log(e));
}));
app.listen("https://valiant.greezy.tk");
console.log("App is logging votes 👍");