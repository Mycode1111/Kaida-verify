const { ButtonStyle } = require('discord.js');

module.exports = {
  token: process.env.BOT_TOKEN, // โทเคนบอท
  roleAdmin: process.env.ROLE_ADMIN, // ยศแอดมิน
  guild: [process.env.GUILD_ID], // เซิฟเวอร์
  WhitelistRole: process.env.WHITELIST_ROLE, // ยศไวริส
  channelId: process.env.CHANNEL_ID, // ห้องสำหรับกดรับ
  channelId_Log: process.env.CHANNEL_ID_LOG, // ห้องสำหรับข้อมูล
  // setting ส่วนหน้ากด
  main: {
    button_msg: "Kaida", // ข้อความปุ่ม
    button_emoji: "<:Kaida:1359680149074870352>", // อิโมจิเท่านั้น สามารถใช้อิโมจิพิเศษได้ ตัวอย่าง `<a:964520638406623232:1258823539210063873>`
    button_style: ButtonStyle.Danger, //จำเป็นต้องมี ButtonStyle อยุ่ข้างหน้าเสมอ มีทั้งหมด 4สี ได้แก่ Primary สีน้ำเงิน , Secondary = เทา , Success = เขียว ,Danger =แดง 
    title: "บอทกรอกข้อมูล", // ชื่อหัวข้อ
    iconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png?ex=68010d3d&is=67ffbbbd&hm=640d920765a9145d3e1ed403b0763a326fd55119536945115a1d2b0e9e766704&", // รูปไอคอน
    footerIconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png?ex=68010d3d&is=67ffbbbd&hm=640d920765a9145d3e1ed403b0763a326fd55119536945115a1d2b0e9e766704&",
    Description: "**แบบฟอร์มกรอกข้อมูล** \n\n" +"📋 **กรุณาอ่านกฎก่อนดำเนินการกรอกข้อมูล** \n" +"```" +"⚠️ ข้อมูลที่กรอกต้องถูกต้องและครบถ้วน ⚠️\n" +"```", // คำอธิบาย


    colors: "#ff0041", // #a7e7ff -> [R, G, B] // 12942973
    image: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png?ex=68010d3d&is=67ffbbbd&hm=640d920765a9145d3e1ed403b0763a326fd55119536945115a1d2b0e9e766704&", // รูปหลัก
  },
  //ชื่อของหัวข้อหลังกดปุ่ม
  modals: {
    title: "กรอกข้อมูล"
  },
  //setting หลังกรอกข้อมูลเสร็จ
  reply_submit: {
    title: "กรอกข้อมูลเรียบร้อยแล้ว", // ชื่อหัวข้อ
    iconURL: "Undefined", // รูปไอคอน
    colors: "#ff0041", // #a7e7ff -> [R, G, B] // 12942973
    footerIconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png?ex=68010d3d&is=67ffbbbd&hm=640d920765a9145d3e1ed403b0763a326fd55119536945115a1d2b0e9e766704&",
    Description: "**คุณได้ทำการกรอกเป็นที่เรียบร้อยแล้ว รอการตรวจสอบ โดย**"
  },
  reply_admin: {
    title: "บอทกรอกข้อมูล", // ชื่อหัวข้อ
    iconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png?ex=68010d3d&is=67ffbbbd&hm=640d920765a9145d3e1ed403b0763a326fd55119536945115a1d2b0e9e766704&", // รูปไอคอน
    footerIconURL: "https://cdn.discordapp.com/attachments/1038838432434229328/1362069141296779394/Kaida_logo.png?ex=68010d3d&is=67ffbbbd&hm=640d920765a9145d3e1ed403b0763a326fd55119536945115a1d2b0e9e766704&",
  }
};
