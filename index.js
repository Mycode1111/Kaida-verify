require('dotenv').config();  // โหลด environment variables 
const express = require('express');
const app = express();
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
const fs = require("fs");

// ✅ Keep alive server
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Keep-alive server is running on port ${PORT}`);
});

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

  const channel = await client.channels.fetch(process.env.CHANNEL_ID).catch(console.error);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Kaida Verify" })
    .setDescription("กดปุ่มเพื่อยืนยันตัวตน")
    .setColor("Red")
    .setImage("https://i.imgur.com/your-image.png")
    .setFooter({ text: "Kaida | Made by wasd" });

  const button = new ButtonBuilder()
    .setCustomId("buttonVerify")
    .setLabel("ยืนยันตัวตน")
    .setEmoji("✅")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

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
      const message = await channel.messages.fetch(data.messageID);
      message.edit({ embeds: [embed], components: [row] });
    } catch (e) {
      data.messageID = "";
      fs.writeFileSync("id.json", JSON.stringify(data));
      await channel.send({ embeds: [embed], components: [row] });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  const logChannel = await client.channels.fetch(process.env.CHANNEL_ID_LOG).catch(console.error);
  if (!logChannel) return;

  if (interaction.isButton() && interaction.customId === "buttonVerify") {
    const modal = new ModalBuilder()
      .setTitle("ยืนยันตัวตน")
      .setCustomId("model_function")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("username")
            .setLabel("ชื่อ")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("age")
            .setLabel("อายุ")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("roblox")
            .setLabel("ชื่อในเกม")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);
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

      const embed = new EmbedBuilder()
        .setAuthor({ name: "ส่งข้อมูลเรียบร้อย" })
        .setDescription(`ข้อมูลของคุณถูกส่งไปยังแอดมินเรียบร้อยแล้ว <@&${process.env.ROLE_ADMIN}>`)
        .setColor("Green")
        .setFooter({ text: "Kaida | Made by wasd" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      const embedAdmin = new EmbedBuilder()
        .setDescription(`# รายละเอียด\n**ดิสคอร์ดผู้ส่ง**\n<@${interaction.member?.id}>\n\nชื่อ\n\`👤 ${username}\`\nอายุ\n\`👤 ${age}\`\nชื่อในเกม\n\`👤 ${roblox}\``)
        .setColor("Red")
        .setFooter({ text: "Kaida" })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("addRoles").setLabel("✅ ยืนยัน").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("Cancel").setLabel("❌ ยกเลิก").setStyle(ButtonStyle.Danger)
      );

      await logChannel.send({
        content: `ส่งข้อมูลโดย: <@${interaction.member?.id}>`,
        embeds: [embedAdmin],
        components: [row],
      });
    } catch (e) {
      console.error("เกิดข้อผิดพลาดใน modal submit:", e);
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "addRoles") {
      interaction.deferUpdate();
      const member = interaction.message.mentions.members.first();
      if (member) {
        member.roles.add(process.env.WHITELIST_ROLE);
      }
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
});

client.login(process.env.BOT_TOKEN);
