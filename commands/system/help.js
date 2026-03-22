const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("help")
.setDescription("Open the ubx Utilities help panel"),

async execute(interaction){

try{

const embed = new EmbedBuilder()
.setTitle("Welcome to the ubx Utilities bot help panel")
.setDescription("Choose what command category you want to see first.")
.setColor(0x2b2d31);

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("help_mod")
.setLabel("Moderation")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("help_links")
.setLabel("Links")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("help_utils")
.setLabel("Utilities")
.setStyle(ButtonStyle.Secondary),

new ButtonBuilder()
.setCustomId("help_fun")
.setLabel("Fun")
.setStyle(ButtonStyle.Danger)

);

await interaction.reply({
embeds:[embed],
components:[row]
});

}catch(error){

console.error("Help command error:", error);

interaction.reply({
content:"Help panel failed to load.",
ephemeral:true
});

}

}

};
