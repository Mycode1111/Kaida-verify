require("dotenv").config();
const keepAlive = require('./keep_alive');
keepAlive();

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

  // ตั้งสถานะในโปรไฟล์ (Custom Status)
  client.user.setPresence({
    activities: [
      {
        name: "กำลังทำงานร่วมกับ Kaida Verify💚", // สถานะที่จะแสดงในโปรไฟล์
        type: "CUSTOM_STATUS",  // ตั้งประเภทเป็น Custom Status
      }
    ],
    status: "online",  // สถานะของบอทคือออนไลน์
  });

  client.user.setActivity("Kaida Verify💚", { type: 0 });

  const channel = await client.channels.fetch(config.channelId).catch(err => {
    console.error("ไม่สามารถโหลด channel:", err);
    return null;
  });
  if (!channel) return;

  const authorData = { name: config.main.title };
  if (isValidUrl(config.main.iconURL)) authorData.iconURL = config.main.iconURL;

  const footerData = { text: "Kaida | Made by wasd" };
  if (isValidUrl(config.main.footerIconURL)) footerData.iconURL = config.main.footerIconURL;

  const embed = new EmbedBuilder()
    .setAuthor(authorData)
    .setDescription(config.main.Description)
    .setColor("Red")
    .setImage(config.main.image)
    .setFooter(footerData);

  const button = new ButtonBuilder()
    .setCustomId("buttonVerify")
    .setLabel(config.main.button_msg)
    .setEmoji(config.main.button_emoji)
    .setStyle(config.main.button_style);

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
    } catch {
      data.messageID = "";
      fs.writeFileSync("id.json", JSON.stringify(data));
      await channel.send({ embeds: [embed], components: [row] });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  const logChannel = await client.channels.fetch(config.channelId_Log).catch(err => {
    console.error("ไม่สามารถโหลด log channel:", err);
    return null;
  });
  if (!logChannel) return;

  if (interaction.isButton()) {
    if (interaction.customId === "buttonVerify") {
      const modal = new ModalBuilder().setTitle(config.modals.title).setCustomId("model_function");

      // เพิ่มคำอธิบายในการกรอกข้อมูล
      const inputName = new TextInputBuilder()
        .setCustomId("username")
        .setLabel("ชื่อเล่น")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder("กรอกชื่อเล่นของคุณ");

      const inputAge = new TextInputBuilder()
        .setCustomId("age")
        .setLabel("อายุ")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder("กรอกอายุของคุณ");

      const inputGame = new TextInputBuilder()
        .setCustomId("roblox")
        .setLabel("ชื่อในเกม")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder("กรอกชื่อในเกม ตัวอย่าง sadSadss (chiffon195)");

      modal.addComponents(
        new ActionRowBuilder().addComponents(inputName),
        new ActionRowBuilder().addComponents(inputAge),
        new ActionRowBuilder().addComponents(inputGame)
      );

      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit()) {
    try {
      const username = interaction.fields.getTextInputValue("username");
      const age = interaction.fields.getTextInputValue("age");
      const roblox = interaction.fields.getTextInputValue("roblox");

      const file = editJsonFile(`${process.cwd()}/config.json`);
      const formData = file.get().data || [];
      formData.push({
        ชื่อดิสคอร์ด: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
        ชื่อ: username,
        อายุ: age,
        ชื่อในเกม: roblox,
      });
      file.set("data", formData);
      file.save();

      const authorReplyData = { name: config.reply_submit.title };
      if (isValidUrl(config.reply_submit.iconURL)) authorReplyData.iconURL = config.reply_submit.iconURL;

      const footerReplyData = { text: "Kaida | Made by wasd" };
      if (isValidUrl(config.reply_submit.footerIconURL)) footerReplyData.iconURL = config.reply_submit.footerIconURL;

      const userEmbed = new EmbedBuilder()
        .setAuthor(authorReplyData)
        .setDescription(`${config.reply_submit.Description} <@&${config.roleAdmin}>`)
        .setColor(config.reply_submit.colors)
        .setFooter(footerReplyData)
        .setTimestamp();

      await interaction.reply({ embeds: [userEmbed], ephemeral: true });

      const authorAdminData = { name: config.reply_admin.title };
      if (isValidUrl(config.reply_admin.iconURL)) authorAdminData.iconURL = config.reply_admin.iconURL;

      const footerAdminData = { text: "Kaida" };
      if (isValidUrl(config.reply_admin.footerIconURL)) footerAdminData.iconURL = config.reply_admin.footerIconURL;

      const adminEmbed = new EmbedBuilder()
        .setDescription(`# รายละเอียด
**ดิสคอร์ดผู้ส่ง**
<@${interaction.member?.id}>

ชื่อ
\`\`\`👤 ${username}\`\`\`
อายุ
\`\`\`👤 ${age}\`\`\`
ชื่อในเกม
\`\`\`👤 ${roblox}\`\`\``)
        .setAuthor(authorAdminData)
        .setColor("Red")
        .setFooter(footerAdminData)
        .setTimestamp();

      const rowx = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("addRoles").setLabel("✅ ยืนยัน").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("Cancel").setLabel("❌ ยกเลิก").setStyle(ButtonStyle.Danger)
      );

      await logChannel.send({
        content: `ส่งข้อมูลโดย: <@${interaction.member?.id}>`,
        embeds: [adminEmbed],
        components: [rowx],
      });
    } catch (e) {
      console.error("เกิดข้อผิดพลาดใน modal submit:", e);
    }
  }
});

client.login(config.token);
