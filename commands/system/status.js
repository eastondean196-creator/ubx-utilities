const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports={

data:new SlashCommandBuilder()
.setName("status")
.setDescription("Check NRG website status"),

async execute(interaction){

try{

await fetch("https://nrg-orcin.vercel.app");

interaction.reply("NRG Website: Online");

}catch{

interaction.reply("NRG Website: Offline");

}

}

};
