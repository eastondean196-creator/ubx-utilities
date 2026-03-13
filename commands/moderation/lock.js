const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("lock")
.setDescription("Lock the channel")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

async execute(interaction){

await interaction.channel.permissionOverwrites.edit(
interaction.guild.roles.everyone,
{ SendMessages: false }
);

interaction.reply("Channel locked");

}

};
