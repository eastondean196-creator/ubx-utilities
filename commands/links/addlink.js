const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Links = require("../../database/links");

module.exports = {

data: new SlashCommandBuilder()
.setName("addlink")
.setDescription("Add a link")
.addStringOption(o =>
o.setName("url")
.setDescription("Link URL")
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

const url = interaction.options.getString("url");
const category = interaction.options.getString("category");

await Links.create({
url,
type: category,   // IMPORTANT (matches panel system)
used:false
});

await interaction.reply({
content:`Link added to **${category.toUpperCase()}** category.`,
ephemeral:true
});

}

};
