const Links = require("../database/links");
const Usage = require("../database/usage");

module.exports = (client)=>{

client.on("interactionCreate", async interaction=>{

if(!interaction.isButton()) return;

//
// HELP BUTTONS
//

if(interaction.customId === "help_mod"){
return interaction.reply({
content:"/ban /kick /timeout /warn /purge",
ephemeral:true
});
}

if(interaction.customId === "help_links"){
return interaction.reply({
content:"/addlink /bulkadd /panel",
ephemeral:true
});
}

if(interaction.customId === "help_utils"){
return interaction.reply({
content:"/status /info",
ephemeral:true
});
}

if(interaction.customId === "help_fun"){
return interaction.reply({
content:"/coinflip /8ball /roll /joke /avatar",
ephemeral:true
});
}

//
// LINK SYSTEM
//

if(!interaction.customId.startsWith("link")) return;

const WEEK = 604800000;
const now = Date.now();

let user = await Usage.findOne({ userId: interaction.user.id });

if(!user){

user = await Usage.create({
userId: interaction.user.id,
weekStart: now,
count: 0
});

}

if(now - user.weekStart > WEEK){
user.weekStart = now;
user.count = 0;
}

let limit = 1;

if(
interaction.member.roles.cache.has(process.env.PREMIUM_ROLE) ||
interaction.member.roles.cache.has(process.env.BOOSTER_ROLE)
){
limit = 3;
}

if(user.count >= limit){
return interaction.reply({
content:"Weekly link limit reached.",
ephemeral:true
});
}

const link = await Links.findOneAndUpdate(
{ used:false },
{ used:true, claimedBy:interaction.user.id, claimedAt:now }
);

if(!link){
return interaction.reply({
content:"No links available.",
ephemeral:true
});
}

user.count++;
await user.save();

if(interaction.customId === "link_dm"){

try{

await interaction.user.send(`Your NRG Link:\n${link.url}`);

return interaction.reply({
content:"Check your DMs!",
ephemeral:true
});

}catch{

return interaction.reply({
content:"Enable DMs to receive links.",
ephemeral:true
});

}

}

if(interaction.customId === "link_reply"){

return interaction.reply({
content:`Your NRG Link:\n${link.url}`,
ephemeral:true
});

}

});

};
