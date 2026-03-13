const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("timeout")
.setDescription("Timeout a user")
.addUserOption(o =>
o.setName("user").setDescription("User").setRequired(true))
.addIntegerOption(o =>
o.setName("minutes").setDescription("Duration in minutes").setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

async execute(interaction){

await interaction.deferReply();

const user = interaction.options.getUser("user");
const minutes = interaction.options.getInteger("minutes");

const member = await interaction.guild.members.fetch(user.id);

await member.timeout(minutes * 60 * 1000);

interaction.editReply(`${user.tag} timed out for ${minutes} minutes`);

}

};
