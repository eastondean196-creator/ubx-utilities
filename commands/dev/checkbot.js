const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
data: new SlashCommandBuilder()
.setName("checkbot")
.setDescription("Scan the bot for possible issues"),

async execute(interaction){

if(interaction.user.id !== process.env.OWNER_ROLE){
return interaction.reply({content:"Owner only command.",ephemeral:true});
}

let results = [];

const requiredEnv = ["TOKEN","MONGO_URI"];

for(const env of requiredEnv){

if(!process.env[env]){
results.push(`❌ Missing ENV variable: ${env}`);
}else{
results.push(`✅ ENV variable found: ${env}`);
}

}

if(mongoose.connection.readyState === 1){
results.push("✅ MongoDB Connected");
}else{
results.push("❌ MongoDB NOT connected");
}

// Check loaded commands instead of requiring files
for(const [name, command] of interaction.client.commands){

if(!command.data){
results.push(`❌ ${name} missing "data"`);
continue;
}

if(!command.execute){
results.push(`❌ ${name} missing "execute()"`);
continue;
}

results.push(`✅ ${name} OK`);

}

const embed = new EmbedBuilder()
.setTitle("🔎 Bot Scan Results")
.setColor("#00AEEF")
.setDescription(results.join("\n").slice(0,4000))
.setFooter({text:"NRG Utilities Diagnostic System"});

await interaction.reply({embeds:[embed],ephemeral:true});

}
};
