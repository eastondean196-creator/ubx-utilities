require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");

const loadCommands = require("./core/loader");

const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
]
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"));

loadCommands(client);

require("./events/interactionCreate")(client);
require("./events/buttons")(client);
require("./events/ready")(client);
require("./events/guildMemberAdd")(client);

client.login(process.env.TOKEN);
