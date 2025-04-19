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
  ActivityType 
} = require("discord.js");

const fs = require("fs");
const config = require("./config");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on("ready", async () => {
  console.log("บอทออนไลน์แล้ว!");

  // ตั้งสถานะ Streaming สีม่วง
  client.user.setPresence({
    status: 'idle',
    activities: [{
      name: 'Kaida',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=bH3vMDK_Hn0'
    }]
  });

  const embed = new EmbedBuilder()
    .setAuthor({ name: config.main.title, iconURL: config.main.iconURL })
    .setDescription(config.main.Description)
    .setColor(config.main.colors)
    .setImage(config.main.image)
    .setFooter({ text: "Kaida | Made by wasd", iconURL: config.main.footerIconURL });

  const button = new ButtonBuilder()
    .setCustomId("buttonVerify")
    .setLabel(config.main.button_msg)
    .setEmoji(config.main.button_emoji)
    .setStyle(config.main.button_style);

  const row = new ActionRowBuilder().addComponents(button);

  let data = { messageID: "" };
  if (fs.existsSync("id.json")) {
    data = JSON.parse(fs.readFileSync("id.json", "utf-8"));
  }

  const channel = await client.channels.fetch(config.channelId);
  if (!data.messageID) {
    const msg = await channel.send({ embeds: [embed], components: [row] });
    data.messageID = msg.id;
    fs.writeFileSync("id.json", JSON.stringify(data, null, 2));
  } else {
    try {
      const msg = await channel.messages.fetch(data.messageID);
      await msg.edit({ embeds: [embed], components: [row] });
    } catch (err) {
      const msg = await channel.send({ embeds: [embed], components: [row] });
      data.messageID = msg.id;
      fs.writeFileSync("id.json", JSON.stringify(data, null, 2));
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton() && interaction.customId === "buttonVerify") {
    const modal = new ModalBuilder()
      .setCustomId("model_function")
      .setTitle(config.modals.title);

    const usernameInput = new TextInputBuilder()
      .setCustomId("username")
      .setLabel("ชื่อเล่น")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder("กรอกชื่อ");

    const ageInput = new TextInputBuilder()
      .setCustomId("age")
      .setLabel("อายุ")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder("กรอกอายุ");

    const robloxInput = new TextInputBuilder()
      .setCustomId("roblox")
      .setLabel("ชื่อในเกม")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder("กรอกชื่อในเกม ตัวอย่าง sadsda (chiffon195)");

    modal.addComponents(
      new ActionRowBuilder().addComponents(usernameInput),
      new ActionRowBuilder().addComponents(ageInput),
      new ActionRowBuilder().addComponents(robloxInput)
    );

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === "model_function") {
    try {
      const username = interaction.fields.getTextInputValue("username");
      const age = interaction.fields.getTextInputValue("age");
      const roblox = interaction.fields.getTextInputValue("roblox");

      const embed = new EmbedBuilder()
        .setDescription(`${config.reply_submit.Description} <@&${config.roleAdmin}>`)
        .setColor("Blue")
        .setFooter({ text: "Kaida | Made by wasd" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      const adminEmbed = new EmbedBuilder()
        .setAuthor({
          name: config.main.title,
          iconURL: config.main.iconURL
        })
        .setDescription(
          `# รายละเอียด\n` +
          `**ดิสคอร์ดผู้ส่ง**\n<@${interaction.member?.id}>\n\n` +
          `ชื่อเล่น\n\`\`\`👤 ${username}\`\`\`\n` +
          `อายุ\n\`\`\`👤 ${age}\`\`\`\n` +
          `ชื่อในเกม\n\`\`\`👤 ${roblox}\`\`\``
        )
        .setColor("Blue")
        .setFooter({
          text: "Kaida | Made by wasd",
          iconURL: config.main.footerIconURL
        })
        .setTimestamp();

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("addRoles")
          .setLabel("✅ ยืนยัน")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("Cancel")
          .setLabel("❌ ยกเลิก")
          .setStyle(ButtonStyle.Danger)
      );

      const logChannel = await client.channels.fetch(config.channelId_Log);
      await logChannel.send({
        content: `ส่งข้อมูลโดย: <@${interaction.user.id}>`,
        embeds: [adminEmbed],
        components: [buttons],
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      await interaction.reply({
        content: `❌ เกิดข้อผิดพลาด: ${error.message}`,
        ephemeral: true,
      });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "addRoles") {
      const member = interaction.message.mentions.members.first();
      if (member) {
        await member.roles.add(config.WhitelistRole);
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("addRoles")
          .setLabel("✅ ยืนยัน")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("Cancel")
          .setLabel("❌ ยกเลิก")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );

      await interaction.update({ components: [row] });
    }

    if (interaction.customId === "Cancel") {
      await interaction.update({ components: [] });
    }
  }
});

client.login(config.token);
