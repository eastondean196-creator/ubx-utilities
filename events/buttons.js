const Links = require("../database/links");
const Usage = require("../database/usage");

module.exports = (client)=>{

// Temporary user selections
const userSelections = new Map();

client.on("interactionCreate", async interaction=>{

//
// ===============================
// HELP BUTTONS
// ===============================
//

if(interaction.isButton()){

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

}

//
// ===============================
// DROPDOWNS
// ===============================
//

if(interaction.isStringSelectMenu()){

let data = userSelections.get(interaction.user.id) || {};

if(interaction.customId === "link_delivery"){
data.delivery = interaction.values[0];
await interaction.reply({ content:"Delivery selected.", ephemeral:true });
}

if(interaction.customId === "link_type"){
data.type = interaction.values[0];
await interaction.reply({ content:"Link type selected.", ephemeral:true });
}

userSelections.set(interaction.user.id, data);

//
// If BOTH selected → send link
//
if(data.delivery && data.type){

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
return interaction.followUp({
content:"Weekly link limit reached.",
ephemeral:true
});
}

const link = await Links.findOneAndUpdate(
{ used:false, type:data.type },
{ used:true, claimedBy:interaction.user.id, claimedAt:now }
);

if(!link){
return interaction.followUp({
content:`No **${data.type.toUpperCase()}** links available.`,
ephemeral:true
});
}

user.count++;
await user.save();

const message = `Your NRG ${data.type.toUpperCase()} Link:\n${link.url}`;

if(data.delivery === "dm"){

try{
await interaction.user.send(message);
await interaction.followUp({ content:"Check your DMs!", ephemeral:true });
}catch{
await interaction.followUp({ content:"Enable DMs to receive links.", ephemeral:true });
}

} else {

await interaction.followUp({
content:message,
ephemeral:true
});

}

// Reset selections
userSelections.delete(interaction.user.id);

}

}

});

};
