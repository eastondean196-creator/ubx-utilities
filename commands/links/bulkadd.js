const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Links = require("../../database/links");

module.exports = {

data: new SlashCommandBuilder()
.setName("bulkadd")
.setDescription("Add multiple links (separate by spaces)")
.addStringOption(o =>
o.setName("links")
.setDescription("Links separated by spaces")
.setRequired(true)
)
.addStringOption(o =>
o.setName("category")
.setDescription("Link category")
.setRequired(true)
.addChoices(
{ name:"NRG Full", value:"full" },
{ name:"NRG Lite", value:"lite" }
))
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

async execute(interaction){

const input = interaction.options.getString("links");
const category = interaction.options.getString("category");

const links = input.split(" ").filter(link => link.trim() !== "");

for(const url of links){

await Links.create({
url,
type: category,
used:false
});

}

await interaction.reply({
content:`Added ${links.length} links to **${category.toUpperCase()}**.`,
ephemeral:true
});

}

};
