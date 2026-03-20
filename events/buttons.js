const { 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} = require("discord.js");

const Links = require("../database/links");
const Usage = require("../database/usage");

module.exports = (client) => {

    const userSelections = new Map();

    client.on("interactionCreate", async interaction => {

        if (interaction.isButton()) {

            if (interaction.customId === "help_mod") {
                return interaction.reply({
                    content: "/ban /kick /timeout /warn /purge",
                    ephemeral: true
                });
            }

            if (interaction.customId === "help_links") {
                return interaction.reply({
                    content: "/addlink /bulkadd /panel",
                    ephemeral: true
                });
            }

            if (interaction.customId === "help_utils") {
                return interaction.reply({
                    content: "/status /info",
                    ephemeral: true
                });
            }

            if (interaction.customId === "help_fun") {
                return interaction.reply({
                    content: "/coinflip /8ball /roll /joke /avatar",
                    ephemeral: true
                });
            }
        }

        if (interaction.isStringSelectMenu()) {

            let data = userSelections.get(interaction.user.id) || {};

            if (interaction.customId === "link_delivery") {
                data.delivery = interaction.values[0];
                await interaction.reply({ content: "Delivery selected.", ephemeral: true });
            }

            if (interaction.customId === "link_type") {
                data.type = interaction.values[0];
                await interaction.reply({ content: "Link type selected.", ephemeral: true });
            }

            userSelections.set(interaction.user.id, data);

            if (data.delivery && data.type) {

                const WEEK = 604800000;
                const now = Date.now();

                let user = await Usage.findOne({ userId: interaction.user.id });

                if (!user) {
                    user = await Usage.create({
                        userId: interaction.user.id,
                        weekStart: now,
                        count: 0
                    });
                }

                if (now - user.weekStart > WEEK) {
                    user.weekStart = now;
                    user.count = 0;
                }

                let limit = 1;

                const isPremium = interaction.member.roles.cache.has(process.env.PREMIUM_ROLE);
                const isBooster = interaction.member.roles.cache.has(process.env.BOOSTER_ROLE);

                if (isPremium || isBooster) {
                    limit = 3;
                }

                if (user.count >= limit) {
                    return interaction.followUp({
                        content: "Weekly link limit reached.",
                        ephemeral: true
                    });
                }

                const link = await Links.findOneAndUpdate(
                    { used: false, type: data.type },
                    { used: true, claimedBy: interaction.user.id, claimedAt: now }
                );

                if (!link) {
                    return interaction.followUp({
                        content: `No **${data.type.toUpperCase()}** links available.`,
                        ephemeral: true
                    });
                }

                user.count++;
                await user.save();

                const message = `Your NRG ${data.type.toUpperCase()} Link:\n${link.url}`;

                if (data.delivery === "dm") {

                    try {
                        await interaction.user.send(message);
                        await interaction.followUp({ content: "Check your DMs!", ephemeral: true });
                    } catch {
                        await interaction.followUp({ content: "Enable DMs to receive links.", ephemeral: true });
                    }

                } else {

                    await interaction.followUp({
                        content: message,
                        ephemeral: true
                    });

                }

                userSelections.delete(interaction.user.id);

                if (client.linkPanelMessage) {

                    const newDelivery = new StringSelectMenuBuilder()
                        .setCustomId("link_delivery")
                        .setPlaceholder("Choose Delivery Method")
                        .addOptions(
                            { label: "Send in DMs", value: "dm", emoji: "📩" },
                            { label: "Send as Reply", value: "reply", emoji: "💬" }
                        );

                    const newType = new StringSelectMenuBuilder()
                        .setCustomId("link_type")
                        .setPlaceholder("Choose Link Type")
                        .addOptions(
                            { label: "UBX Full", value: "full", emoji: "⚡" },
                            { label: "Nothing", value: "lite", emoji: "🪟" }
                        );

                    await client.linkPanelMessage.edit({
                        components: [
                            new ActionRowBuilder().addComponents(newDelivery),
                            new ActionRowBuilder().addComponents(newType)
                        ]
                    });

                }

            }

        }

    });

};
