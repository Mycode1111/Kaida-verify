require('dotenv').config();
const express = require('express');
const {
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  GatewayIntentBits,
} = require("discord.js");
const editJsonFile = require("edit-json-file");
const config = require("./config");
const fs = require("fs");

// ✅ KEEP ALIVE FUNCTION
function keepAlive() {
  const app = express();
  app.get('/', (req, res) => {
    res.send('Bot is alive!');
  });
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Keep-alive server running on port ${PORT}`);
  });
}

keepAlive();

const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", async () => {
  console.log("บอทออนไลน์แล้ว!");
  client.user.setActivity("Kaida Verify💚", { type: 0 });

  const channel = await client.channels.fetch(config.channelId).catch(console.error);
  if (!channel) return;

  const authorData = { name: `${config.main.title}` };
  if (isValidUrl(config.main.iconURL)) authorData.iconURL = config.main.iconURL;
  const footerData = { text: "Kaida | Made by wasd" };
  if (isValidUrl(config.main.footerIconURL)) footerData.iconURL = config.main.footerIconURL;

  const embed = new EmbedBuilder()
    .setAuthor(authorData)
    .setDescription(`${config.main.Description}`)
    .setColor("Red")
    .setImage(`${config.main.image}`)
    .setFooter(footerData);

  const x = new ButtonBuilder()
    .setCustomId("buttonVerify")
    .setLabel(`${config.main.button_msg}`)
    .setEmoji(`${config.main.button_emoji}`)
    .setStyle(config.main.button_style);

  const row = new ActionRowBuilder().addComponents(x);

  let data = {};
  try {
    const rawData = fs.readFileSync("id.json");
    data = JSON.parse(rawData);
  } catch {
    data = { messageID: "" };
  }

  if (!data.messageID) {
    const message = await channel.send({ embeds: [embed], components: [row] });
    data.messageID = message.id;
    fs.writeFileSync("id.json", JSON.stringify(data));
  } else {
    try {
      const messages = await channel.messages.fetch(data.messageID);
      messages.edit({ embeds: [embed], components: [row] });
    } catch (s) {
      data.messageID = "";
      fs.writeFileSync("id.json", JSON.stringify(data));
      await channel.send({ embeds: [embed], components: [row] });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  const channel = await client.channels.fetch(config.channelId_Log).catch(console.error);
  if (!channel) return;

  if (interaction.isButton()) {
    if (interaction.customId === "buttonVerify") {
      const modal = new ModalBuilder().setTitle(config.modals.title).setCustomId("model_function");
      const inputName = new TextInputBuilder().setCustomId("username").setLabel("ชื่อ").setStyle(TextInputStyle.Short).setRequired(true);
      const inputAge = new TextInputBuilder().setCustomId("age").setLabel("อายุ").setStyle(TextInputStyle.Short).setRequired(true);
      const inputGame = new TextInputBuilder().setCustomId("roblox").setLabel("ชื่อในเกม").setStyle(TextInputStyle.Short).setRequired(true);
      modal.addComponents(
        new ActionRowBuilder().addComponents(inputName),
        new ActionRowBuilder().addComponents(inputAge),
        new ActionRowBuilder().addComponents(inputGame)
      );
      await interaction.showModal(modal);
    }

    if (interaction.customId === "addRoles") {
      interaction.deferUpdate();
      const WhitelistRole = `${config.WhitelistRole}`;
      const m = interaction.message?.mentions.members.first();
      m.roles.add(WhitelistRole);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("addRoles").setLabel("✅ ยืนยัน").setStyle(ButtonStyle.Primary).setDisabled(true),
        new ButtonBuilder().setCustomId("Cancel").setLabel("❌ ยกเลิก").setStyle(ButtonStyle.Danger).setDisabled(true)
      );

      interaction.message.edit({ components: [row] });
    }

    if (interaction.customId === "Cancel") {
      interaction.message.edit({ components: [] });
    }
  }

  if (interaction.isModalSubmit()) {
    try {
      const username = interaction.fields.getTextInputValue("username");
      const age = interaction.fields.getTextInputValue("age");
      const roblox = interaction.fields.getTextInputValue("roblox");

      let file = editJsonFile(`${process.cwd()}/config.json`);
      let data = file.get().data || [];
      data.push({
        ชื่อดิสคอร์ด: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
        ชื่อ: username,
        อายุ: age,
        ชื่อในเกม: roblox,
      });
      file.set("data", data);
      file.save();

      const authorReplyData = { name: config.reply_submit.title };
      if (isValidUrl(config.reply_submit.iconURL)) authorReplyData.iconURL = config.reply_submit.iconURL;
      const footerReplyData = { text: "Kaida | Made by wasd" };
      if (isValidUrl(config.reply_submit.footerIconURL)) footerReplyData.iconURL = config.reply_submit.footerIconURL;

      const embed = new EmbedBuilder()
        .setAuthor(authorReplyData)
        .setDescription(`${config.reply_submit.Description} <@&${config.roleAdmin}>`)
        .setColor(config.reply_submit.colors)
        .setFooter(footerReplyData)
        .setTimestamp(Date.now());

      interaction.reply({ embeds: [embed], ephemeral: true });

      const authorAdminData = { name: config.reply_admin.title };
      if (isValidUrl(config.reply_admin.iconURL)) authorAdminData.iconURL = config.reply_admin.iconURL;
      const footerAdminData = { text: "Kaida" };
      if (isValidUrl(config.reply_admin.footerIconURL)) footerAdminData.iconURL = config.reply_admin.footerIconURL;

      const embedadmin = new EmbedBuilder()
        .setDescription(`# รายละเอียด\n**ดิสคอร์ดผู้ส่ง**\n<@${interaction.member?.id}>\n\nชื่อ\n\\`\\`\\`👤 ${username}\\`\\`\\`\nอายุ\n\\`\\`\\`👤 ${age}\\`\\`\\`\nชื่อในเกม\n\\`\\`\\`👤 ${roblox}\\`\\`\\``)
        .setAuthor(authorAdminData)
        .setColor("Red")
        .setFooter(footerAdminData)
        .setTimestamp(Date.now());

      const rowx = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("addRoles").setLabel("✅ ยืนยัน").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("Cancel").setLabel("❌ ยกเลิก").setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        content: `ส่งข้อมูลโดย: <@${interaction.member?.id}>`,
        embeds: [embedadmin],
        components: [rowx],
      });
    } catch (e) {
      console.error("เกิดข้อผิดพลาดใน modal submit:", e);
    }
  }
});

client.login(config.token);
