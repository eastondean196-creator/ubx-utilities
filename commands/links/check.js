const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require("discord.js");
require("dotenv").config();
 
// ── Filter imports (place this file one level above the filters/ folder) ────
const { aristotlek12 }           = require("./filters/aristotle.js");
const { blocksiAI, blocksiStandard } = require("./filters/blocksi.js");
const { cisco }                  = require("./filters/cisco.js");
const { contentkeeper }          = require("./filters/contentkeeper.js");
const { deledao }                = require("./filters/deledao.js");
const { fortiguard }             = require("./filters/fortiguard.js");
const { goguardian }             = require("./filters/goguardian.js");
const { iboss }                  = require("./filters/iboss.js");
const { lanschool }              = require("./filters/lanschool.js");
const { lightspeed }             = require("./filters/lightspeed.js");
const { linewize }               = require("./filters/linewize.js");
const { palo }                   = require("./filters/paloalto.js");
const { securly }                = require("./filters/securly.js");
const { sensocloud }             = require("./filters/senso.js");
 
const TOKEN     = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
 
if (!TOKEN || !CLIENT_ID) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in .env");
  process.exit(1);
}
 
// ── Filter registry ──────────────────────────────────────────────────────────
// Every filter's run() must resolve to [category, blocked] or "Error"
const FILTERS = [
  {
    key: "goguardian",
    label: "GoGuardian",
    emoji: "🟢",
    run: (url) => goguardian(url),
  },
  {
    key: "blocksi_ai",
    label: "Blocksi (AI)",
    emoji: "🤖",
    run: (url) => blocksiAI(url),
  },
  {
    key: "blocksi_std",
    label: "Blocksi (Standard)",
    emoji: "🔲",
    run: (url) => blocksiStandard(url),
  },
  {
    key: "cisco",
    label: "Cisco Talos",
    emoji: "🔵",
    run: (url) => cisco(url),
  },
  {
    key: "fortiguard",
    label: "FortiGuard",
    emoji: "🟠",
    run: async (url) => {
      const r = await fortiguard(url);
      if (!r || r === "Error") return "Error";
      return [r.category, r.blocked];
    },
  },
  {
    key: "iboss",
    label: "iBoss",
    emoji: "⚫",
    run: (url) => iboss(url),
  },
  {
    key: "lightspeed",
    label: "Lightspeed",
    emoji: "⚡",
    run: (url) => lightspeed(url),
  },
  {
    key: "linewize",
    label: "Linewize",
    emoji: "🔗",
    run: (url) => linewize(url),
  },
  {
    key: "paloalto",
    label: "Palo Alto",
    emoji: "🟡",
    run: (url) => palo(url),
  },
  {
    key: "securly",
    label: "Securly",
    emoji: "🔒",
    run: (url) => securly(url),
  },
  {
    key: "senso",
    label: "Senso Cloud",
    emoji: "☁️",
    run: (url) => sensocloud(url),
  },
  {
    key: "aristotle",
    label: "Aristotle K12",
    emoji: "📚",
    run: async (url) => {
      const r = await aristotlek12(url);
      if (!r || r === "Error") return "Error";
      return [r.category ?? "Unknown", r.blocked ?? false];
    },
  },
  {
    key: "contentkeeper",
    label: "ContentKeeper",
    emoji: "🗝️",
    run: async (url) => {
      const r = await contentkeeper(url);
      if (!r || r === "Error") return "Error";
      return [r.category, r.blocked];
    },
  },
  {
    key: "deledao",
    label: "Deledao",
    emoji: "🧠",
    run: (url) => deledao(url),
  },
  {
    key: "lanschool",
    label: "LanSchool",
    emoji: "🏫",
    run: async (url) => {
      const r = await lanschool(url);
      if (!r || r === "Error") return "Error";
      if (typeof r === "string") return [r, r !== "LanSchool"];
      return [r.name ?? "Unknown", r.blocked ?? false];
    },
  },
];
 
// ── Slash commands ───────────────────────────────────────────────────────────
const commands = [
  new SlashCommandBuilder()
    .setName("check")
    .setDescription("Check a URL against all content filters")
    .addStringOption((o) =>
      o.setName("url").setDescription("URL to check (e.g. https://example.com)").setRequired(true)
    ),
 
  new SlashCommandBuilder()
    .setName("checkfilter")
    .setDescription("Check a URL against one specific filter")
    .addStringOption((o) =>
      o.setName("url").setDescription("URL to check").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("filter")
        .setDescription("Which filter to use")
        .setRequired(true)
        .addChoices(...FILTERS.map((f) => ({ name: f.label, value: f.key })))
    ),
 
  new SlashCommandBuilder()
    .setName("filters")
    .setDescription("List all supported content filters"),
].map((c) => c.toJSON());
 
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  console.log("Registering slash commands...");
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  console.log("Slash commands registered.");
}
 
// ── Helpers ──────────────────────────────────────────────────────────────────
function normalizeUrl(raw) {
  raw = raw.trim();
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  return raw;
}
 
function formatRow(filter, result) {
  if (!result || result === "Error") {
    return `${filter.emoji} **${filter.label}** — ⚠️ Error`;
  }
  const [category, blocked] = result;
  const status = blocked ? "🔴 Blocked" : "🟢 Allowed";
  return `${filter.emoji} **${filter.label}** — ${status} · \`${category || "Unknown"}\``;
}
 
// ── Bot ───────────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
 
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity("URLs 👀");
});
 
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
 
  // /filters — list all filters
  if (interaction.commandName === "filters") {
    const embed = new EmbedBuilder()
      .setTitle("Supported Content Filters")
      .setColor(0x5865f2)
      .setDescription(FILTERS.map((f) => `${f.emoji} **${f.label}**`).join("\n"));
    return interaction.reply({ embeds: [embed] });
  }
 
  // /check — run all filters in parallel
  if (interaction.commandName === "check") {
    const url = normalizeUrl(interaction.options.getString("url"));
    await interaction.deferReply();
 
    const results = await Promise.all(
      FILTERS.map((f) =>
        f.run(url).catch(() => "Error")
      )
    );
 
    const rows = FILTERS.map((f, i) => formatRow(f, results[i]));
    const blockedCount = results.filter((r) => Array.isArray(r) && r[1] === true).length;
    const allowedCount = results.filter((r) => Array.isArray(r) && r[1] === false).length;
    const errorCount   = results.filter((r) => !r || r === "Error").length;
 
    const embed = new EmbedBuilder()
      .setTitle(`Filter Check: ${url}`)
      .setColor(blockedCount > allowedCount ? 0xed4245 : 0x57f287)
      .setDescription(rows.join("\n"))
      .addFields(
        { name: "🔴 Blocked", value: String(blockedCount), inline: true },
        { name: "🟢 Allowed", value: String(allowedCount), inline: true },
        { name: "⚠️ Errors",  value: String(errorCount),  inline: true }
      )
      .setFooter({ text: `Checked ${FILTERS.length} filters` })
      .setTimestamp();
 
    return interaction.editReply({ embeds: [embed] });
  }
 
  // /checkfilter — run one filter
  if (interaction.commandName === "checkfilter") {
    const url       = normalizeUrl(interaction.options.getString("url"));
    const filterKey = interaction.options.getString("filter");
    const filter    = FILTERS.find((f) => f.key === filterKey);
 
    if (!filter) return interaction.reply({ content: "Unknown filter.", ephemeral: true });
 
    await interaction.deferReply();
 
    let result;
    try {
      result = await filter.run(url);
    } catch {
      result = "Error";
    }
 
    const row = formatRow(filter, result);
    const embed = new EmbedBuilder()
      .setTitle(`${filter.emoji} ${filter.label} — Filter Check`)
      .setColor(
        result === "Error"      ? 0xfee75c :
        Array.isArray(result) && result[1] ? 0xed4245 : 0x57f287
      )
      .setDescription(`**URL:** ${url}\n\n${row}`)
      .setTimestamp();
 
    return interaction.editReply({ embeds: [embed] });
  }
});
 
// ── Start ─────────────────────────────────────────────────────────────────────
(async () => {
  await registerCommands();
  await client.login(TOKEN);
})();
