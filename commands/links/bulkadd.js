const { SlashCommandBuilder } = require("discord.js");
const Links = require("../../database/links");

module.exports={

data:new SlashCommandBuilder()
.setName("bulkadd")
.setDescription("Add multiple links")
.addStringOption(o=>o.setName("links").setRequired(true)),

async execute(interaction){

const list = interaction.options.getString("links").split("\n");

for(const link of list){
await Links.create({url:link});
}

interaction.reply("Links added");

}

};
