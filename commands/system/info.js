const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports={

data:new SlashCommandBuilder()
.setName("info")
.setDescription("NRG bot info"),

async execute(interaction){

const embed = new EmbedBuilder()
.setTitle("UBX Utilities Bot")
.setDescription(`
This is a the Utilities bot for UBX

Made by RVEPRTY
`);

interaction.reply({embeds:[embed]});

}

};
