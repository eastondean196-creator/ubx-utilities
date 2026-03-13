const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("slowmode")
.setDescription("Set channel slowmode")
.addIntegerOption(option =>
option
.setName("seconds")
.setDescription("Slowmode duration in seconds")
.setRequired(true)
)
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

async execute(interaction){

const seconds = interaction.options.getInteger("seconds");

await interaction.channel.setRateLimitPerUser(seconds);

interaction.reply(`Slowmode set to ${seconds} seconds`);

}

};
