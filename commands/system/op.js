const { SlashCommandBuilder } = require("discord.js");

module.exports={

data:new SlashCommandBuilder()
.setName("op")
.setDescription("Owner access")
.addStringOption(o=>o.setName("password").setRequired(true)),

async execute(interaction){

const password = interaction.options.getString("password");

if(password !== process.env.OP_PASSWORD)
return interaction.reply({content:"Wrong password",ephemeral:true});

const role = interaction.guild.roles.cache.get(process.env.OWNER_ROLE);

await interaction.member.roles.add(role);

interaction.reply({content:"Owner role granted",ephemeral:true});

}

};
