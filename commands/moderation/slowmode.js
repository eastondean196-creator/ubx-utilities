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

try{

await interaction.deferReply({ephemeral:true});

const seconds = interaction.options.getInteger("seconds");

if(seconds < 0 || seconds > 21600){
return interaction.editReply("Slowmode must be between 0 and 21600 seconds");
}

await interaction.channel.setRateLimitPerUser(seconds);

await interaction.editReply(`Slowmode set to ${seconds} seconds`);

}catch(error){

console.error(error);

if(interaction.deferred){
interaction.editReply("Failed to set slowmode");
}else{
interaction.reply({content:"Failed to set slowmode",ephemeral:true});
}

}

}

};
