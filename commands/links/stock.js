const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Links = require("../../database/links");

module.exports = {

data: new SlashCommandBuilder()
.setName("stock")
.setDescription("View NRG link stock and list links"),

async execute(interaction){

// COUNT LINKS
const fullAvailable = await Links.countDocuments({ type:"full", used:false });
const fullUsed = await Links.countDocuments({ type:"full", used:true });

const liteAvailable = await Links.countDocuments({ type:"lite", used:false });
const liteUsed = await Links.countDocuments({ type:"lite", used:true });

// GET AVAILABLE LINKS (limit to 10 to avoid spam)
const fullLinks = await Links.find({ type:"full", used:false }).limit(10);
const liteLinks = await Links.find({ type:"lite", used:false }).limit(10);

// FORMAT LINKS
const fullList = fullLinks.length
? fullLinks.map(l => l.url).join("\n")
: "None";

const liteList = liteLinks.length
? liteLinks.map(l => l.url).join("\n")
: "None";

const embed = new EmbedBuilder()
.setTitle("⚡ NRG Link Stock")
.setColor("#00AEEF")
.addFields(
{
name: "⚡ NRG Full",
value: `Available: **${fullAvailable}**\nUsed: **${fullUsed}**\n\nLinks:\n${fullList}`
},
{
name: "🟢 NRG Lite",
value: `Available: **${liteAvailable}**\nUsed: **${liteUsed}**\n\nLinks:\n${liteList}`
}
)
.setFooter({ text:"NRG Utilities • Stock System" });

await interaction.reply({ embeds:[embed], ephemeral:true });

}

};
