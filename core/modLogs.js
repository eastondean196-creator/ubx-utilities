const { EmbedBuilder } = require("discord.js");

async function sendModLog(client, guild, data) {

const logChannelId = process.env.MOD_LOG_CHANNEL;
if (!logChannelId) return;

const channel = await client.channels.fetch(logChannelId).catch(() => null);
if (!channel) return;

const embed = new EmbedBuilder()
.setColor(data.color || "Red")
.setTitle(data.title || "Moderation Action")
.addFields(
{
name: "User",
value: data.user ? String(data.user) : "N/A",
inline: true
},
{
name: "Moderator",
value: data.moderator ? String(data.moderator) : "N/A",
inline: true
},
{
name: "Reason",
value: data.reason ? String(data.reason) : "No reason provided"
}
)
.setTimestamp();

await channel.send({ embeds: [embed] });

}

module.exports = { sendModLog };
