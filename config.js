const { ButtonStyle } = require('discord.js');

module.exports = {
  token: process.env.BOT_TOKEN,
  roleAdmin: process.env.ROLE_ADMIN,
  guild: [process.env.GUILD_ID],
  WhitelistRole: process.env.WHITELIST_ROLE,
  channelId: process.env.CHANNEL_ID,
  channelId_Log: process.env.CHANNEL_ID_LOG,
  main: {
    button_msg: "Kaida",
    button_emoji: "<:Kaida:1359680149074870352>",
    button_style: ButtonStyle.Secondary,
    title: "บอทกรอกข้อมูล",
    iconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png",
    footerIconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png",
    Description: "```ansi \n[1;2m[1;34mแบบฟอร์มกรอกข้อมูล \n``` \n\n📋 **กรุณาอ่านกฎก่อนดำเนินการกรอกข้อมูล** \n```<a:warn:1331879158523101236> ข้อมูลที่กรอกต้องถูกต้องและครบถ้วน <a:warn:1331879158523101236>```",
    colors: "#e51c23",
    image: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png",
  },
  modals: {
    title: "กรอกข้อมูล"
  },
  reply_submit: {
    title: "กรอกข้อมูลเรียบร้อยแล้ว",
    colors: "Red",
    footerIconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png",
    Description: "**คุณได้ทำการกรอกเป็นที่เรียบร้อยแล้ว รอการตรวจสอบ โดย**"
  },
  reply_admin: {
    title: "บอทกรอกข้อมูล",
    iconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png",
    footerIconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png",
  }
};
