const { SlashCommandBuilder } = require("discord.js");
const Links = require("../../database/links");

module.exports={

data:new SlashCommandBuilder()
.setName("addlink")
.setDescription("Add a link")
.addStringOption(o=>o.setName("url").setRequired(true)),

async execute(interaction){

if(!interaction.member.roles.cache.has(process.env.ADMIN_ROLE))
return interaction.reply({content:"No permission",ephemeral:true});

const url = interaction.options.getString("url");

await Links.create({url});

interaction.reply("Link added");

}

};
