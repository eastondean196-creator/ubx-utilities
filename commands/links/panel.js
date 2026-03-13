const {
SlashCommandBuilder,
EmbedBuilder,
ActionRowBuilder,
StringSelectMenuBuilder,
PermissionFlagsBits
} = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("panel")
.setDescription("Create link dispenser panel")
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

async execute(interaction){

const embed = new EmbedBuilder()
.setTitle("⚡ NRG Link Dispenser")
.setDescription(`
Welcome to the official NRG Link System.

📌 Rules:
• Normal Users: 1 link per week  
• NRG Premium / Booster: 3 links per week  

Select BOTH options below before a link is sent.
`)
.setColor("#00AEEF")
.setFooter({ text:"NRG Utilities • Automated System" });

const deliveryMenu = new StringSelectMenuBuilder()
.setCustomId("link_delivery")
.setPlaceholder("Choose Delivery Method")
.addOptions(
{
label:"Send in DMs",
value:"dm",
emoji:"📩"
},
{
label:"Send as Reply",
value:"reply",
emoji:"💬"
}
);

const typeMenu = new StringSelectMenuBuilder()
.setCustomId("link_type")
.setPlaceholder("Choose Link Type")
.addOptions(
{
label:"NRG Full",
value:"full",
emoji:"⚡"
},
{
label:"NRG Lite",
value:"lite",
emoji:"🟢"
}
);

await interaction.channel.send({
embeds:[embed],
components:[
new ActionRowBuilder().addComponents(deliveryMenu),
new ActionRowBuilder().addComponents(typeMenu)
]
});

await interaction.reply({
content:"Dispenser panel created.",
ephemeral:true
});

}

};
