const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

module.exports = {
data: new SlashCommandBuilder()
.setName("checkbot")
.setDescription("Scan the bot for possible issues"),

async execute(interaction){

// OWNER CHECK
if(interaction.user.id !== process.env.OWNER_ID){
return interaction.reply({content:"Owner only command.",ephemeral:true});
}

let results = [];

//
// ENV CHECK
//

const requiredEnv = [
"TOKEN",
"MONGO_URI"
];

for(const env of requiredEnv){

if(!process.env[env]){
results.push(`❌ Missing ENV variable: ${env}`);
}else{
results.push(`✅ ENV variable found: ${env}`);
}

}

//
// DATABASE CHECK
//

if(mongoose.connection.readyState === 1){
results.push("✅ MongoDB Connected");
}else{
results.push("❌ MongoDB NOT connected");
}

//
// COMMAND CHECK
//

const commandFolders = fs.readdirSync("./commands");

for(const folder of commandFolders){

const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(f=>f.endsWith(".js"));

for(const file of commandFiles){

try{

const command = require(path.join(process.cwd(),`commands/${folder}/${file}`));

if(!command.data){
results.push(`❌ ${file} missing "data"`);
continue;
}

if(!command.execute){
results.push(`❌ ${file} missing "execute()"`);
continue;
}

results.push(`✅ ${file} OK`);

}catch(err){

results.push(`❌ ${file} crashed while loading`);

}

}

}

//
// EMBED OUTPUT
//

const embed = new EmbedBuilder()
.setTitle("🔎 Bot Scan Results")
.setColor("#00AEEF")
.setDescription(results.join("\n").slice(0,4000))
.setFooter({text:"NRG Utilities Diagnostic System"});

interaction.reply({embeds:[embed],ephemeral:true});

}

};
