const { SlashCommandBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const Links = require("../../database/links");

module.exports = {

data: new SlashCommandBuilder()
.setName("stock")
.setDescription("Export all available ubx links")
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

async execute(interaction){


const fullLinks = await Links.find({ type:"full", used:false });
const liteLinks = await Links.find({ type:"lite", used:false });

const fullCount = fullLinks.length;
const liteCount = liteLinks.length;

const fullList = fullLinks.map(link => link.url).join("\n");
const liteList = liteLinks.map(link => link.url).join("\n");

const textContent = 
`ubx LINK STOCK EXPORT

========================
⚡ UBX FULL LINKS
Available: ${fullCount}
========================

${fullList || "None"}

========================
🟢 IGNORE THIS PLEASE
Available: ${liteCount}
========================

${liteList || "None"}
`;


const buffer = Buffer.from(textContent, "utf-8");

const file = new AttachmentBuilder(buffer, {
name: "ubx-link-stock.txt"
});


await interaction.reply({
content: "Here is the full UBX link stock export.",
files: [file],
ephemeral: true
});

}

};
