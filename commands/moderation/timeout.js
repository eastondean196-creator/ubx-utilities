const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendModLog } = require("../../core/modLogs");

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

try{

await interaction.deferReply();

const user = interaction.options.getUser("user");
const minutes = interaction.options.getInteger("minutes");

if(minutes <= 0 || minutes > 10080){
return interaction.editReply("Minutes must be between 1 and 10080.");
}

const member = await interaction.guild.members.fetch(user.id);

if(!member.moderatable){
return interaction.editReply("I cannot timeout this user.");
}

await member.timeout(minutes * 60 * 1000);

await interaction.editReply(`${user.tag} timed out for ${minutes} minutes`);

await sendModLog(interaction.client, interaction.guild, {
title:"⏳ Timeout",
color:"Yellow",
user:user.tag,
moderator:interaction.user.tag,
reason:`${minutes} minutes`
});

}catch(error){

console.error(error);
interaction.editReply("Failed to timeout user.");

}

}

};
