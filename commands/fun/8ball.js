const { SlashCommandBuilder } = require("discord.js");

const responses = [
"Yes.",
"No.",
"Maybe.",
"Definitely.",
"Absolutely not.",
"Ask again later.",
"It is certain.",
"emit gas from the anus.",
"Very doubtful."
];

module.exports = {
data: new SlashCommandBuilder()
.setName("8ball")
.setDescription("Ask the magic 8ball")
.addStringOption(o =>
o.setName("question")
.setDescription("Your question")
.setRequired(true)),

async execute(interaction){

const question = interaction.options.getString("question");
const answer = responses[Math.floor(Math.random() * responses.length)];

await interaction.reply(`🎱 **Question:** ${question}\n**Answer:** ${answer}`);

}
};
