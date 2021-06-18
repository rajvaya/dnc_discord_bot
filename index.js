///imports

require('dotenv').config()
const Discord = require('discord.js');
const creds = require('./dnc-discord-bot-cd96b5969dbf.json');
const BOT = new Discord.Client();
const fetch = require("node-fetch");
const musakui = require('musakui');
var validator = require("email-validator");
const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('***removed****');
const isTesting = process.env.test_mode;

///LISTS
clansIDs = ["742398153281765386", "742398412372181162", "742398528567115887"];
clanNames = ["House Animus", "House Novus", "House Lacertus"];
subreddits =["designmemes", "designershumor","ProgrammerHumor","programmingmemes","facepalm","shittyprogramming","comedyheaven","programminghumor" ,"codinghumor","desimemes","webcomics","Bumble","puns","standupshots","woooosh","funny","comics","ComedyCemetery","starterpacks","trippinthroughtime","mildlyinteresting","FunnyandSad","terriblefacebookmemes",];


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}




function getMEME(subreddit , msg) {
  console.log("fetching........ meme form " + subreddit);
  musakui(subreddit)  
      .then(result => {
      console.log("found meme with this caption " + result.media_url);
      console.log("INSIDE try before send");
      checkData(result);
      const embed = new Discord.MessageEmbed()
      .setColor("#31E085")
      .setDescription(result.content)
      .setTitle(result.title)
      .setImage(result.media_url);
      msg.channel.send(
        embed
      ).then(done=>{
        msg.channel.stopTyping();
        })
        .catch(error =>{
         console.log("got error while sending");
         getMEME(subreddit,msg);
        });
  
      }
      ).catch(error => {
          msg.channel.stopTyping();
          getMEME(subreddit,msg);
          return console.log(error);
      });
    }



function checkData(res){
  if(res.nsfw) throw "nsfw";
  if(!res.media_url) throw "No Media";
  if(!res.media_url.includes(".png")&&!res.media_url.includes(".jpg")) throw "not valid format";
}

BOT.on('ready', () => {
  console.log(`Logged in as ${BOT.user.tag}!`);
});

BOT.on("guildMemberAdd", async function (member) {
  if(isTesting=="yes") return;
  switch (getRandomInt(3)) {
    case 0: {
      member.roles.add(member.guild.roles.cache.find(role => role.name === clanNames[0]));
      member.send(msgBuilder(member.displayName, 0));
      console.log(`${member.displayName} joined the server and ${clanNames[0]} Clan is Assigned`);
    }
      break;
    case 1: {
      member.roles.add(member.guild.roles.cache.find(role => role.name === clanNames[1]));
      member.send(msgBuilder(member.displayName, 1));
      console.log(`${member.displayName} joined the server and ${clanNames[1]} Clan is Assigned`);
    }
      break;
    case 2: {
      member.roles.add(member.guild.roles.cache.find(role => role.name === clanNames[2]));
      member.send(msgBuilder(member.displayName, 2));
      console.log(`${member.displayName} joined the server and ${clanNames[2]} Clan is Assigned`);

    }
    break;
  }
});

function msgBuilder(name, index) {
  console.log(name);
  console.log(index);
  WelcomeMsg = `**Hey ${name} (${clanNames[index]}) \uD83D\uDC4B**\r\nWelcome to the **Design & Code Community**!\r\n\r\nNow that you are a part of the **awesome community**, and would be learning so many things from everyone here. \r\nWe would like to **go one step further and help you** get the best of all the **resources and discussion** happening here and around. \r\n\r\nFor that, we have made a **Special List**, where we share **extra resources, insights, tips & tricks, updates** on what\'s coming and many other awesome things. \r\n\r\n**Don\'t miss out the opportunity to get the access!**\r\n\r\n---\r\n\r\n**\u2328\uFE0F Type:**\r\n"**Yes**\" to join the **Special List** & \"**No**\" to miss out the opportunity.`
  return WelcomeMsg;
}

BOT.on('message', async function (msg) {
  
   
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") {
    if(isTesting=="yes") return;
    console.log(`${msg.author.tag} sent ${msg.content} to D&C BOT`);
    if (BOT.guilds.cache.get('698823810652176385').members.cache.get(msg.author.id).roles.cache.has("740152603803123805")) return;
    switch (msg.content.toLowerCase()) {
      case "yes":
        {   
          
          msg.reply("Awesome \uD83D\uDE4C\r\nJust type in your Email & First Name, and you in for the Special List \uD83D\uDE0E\r\n---\r\n\u27A1\uFE0F **Example**\r\nadam@gmail.com Adam");
        }
        break;
      case "no": {  

        try {

          BOT.guilds.cache.get('698823810652176385').members.cache.get(msg.author.id).roles.add("740152603803123805");
          msg.reply("That\'s sad \uD83D\uDE22\r\n**You are missing a lot!** Just saying that \uD83E\uDD37\u200D\u2640\uFE0F\r\n\r\nIf by any chance you change your mind ping any of the Core Team Member to join into the Special List.\r\n\r\n---\r\n\r\nAnd yeah one last thing, you can find us on **other cool platforms** too.\r\n\r\n\uD83D\uDCF7  Instagram: <https:\/\/bit.ly\/3dF96fk>\r\n\uD83D\uDD34  YouTube: <https:\/\/bit.ly\/3eIzUNa>\r\n\uD83D\uDC24  Twitter: <http:\/\/bit.ly\/2SR2wsj>\r\n\r\nKeep Learning, Keep Creating \u270C\uFE0F");
        } catch (error) {
          console.log("error" + error);
          console.log(`\n msg object is \n ${msg}`);
          msg.reply("Something Went Wrong Try Again Or Contact @raj vaya");
        }
     

      }
        break;
      default:
        {

          if (msg.content.split(" ").length == 2) {
            if (validator.validate(msg.content.split(" ")[0].toLowerCase())) {
              try {
                await doc.useServiceAccountAuth(creds);
                await doc.loadInfo();
              
                var sheet = doc.sheetsByIndex[0];
                rowadded = await sheet.addRow({ Email_ID: msg.content.split(" ")[0], Name: msg.content.split(" ")[1], Discord_ID: msg.author.tag });
                console.log(`${msg.content.split(" ")[1]}'s email : ${msg.content.split(" ")[0]} added to Sheet`);
                BOT.guilds.cache.get('698823810652176385').members.cache.get(msg.author.id).roles.add("740152603803123805");
                msg.reply("Awesome \uD83D\uDE4C\r\n**You are on the Special List now**, just keep an eye your \u2709\uFE0F\r\n\r\n---\r\n\r\nAnd yeah one last thing, you can find us on **other cool platforms** too.\r\n\r\n\uD83D\uDCF7  Instagram: <https:\/\/bit.ly\/3dF96fk>\r\n\uD83D\uDD34  YouTube: <https:\/\/bit.ly\/3eIzUNa>\r\n\uD83D\uDC24  Twitter: <http:\/\/bit.ly\/2SR2wsj>\r\n\r\nKeep Learning, Keep Creating \u270C\uFE0F");
                return;
              } catch (error) {
                console.log("error" + error);
                console.log(`\n msg object is \n ${msg}`);
                msg.reply("Something Went Wrong Try Again Or Contact @raj vaya");
                return;
              }
            }
            msg.reply('That\'s not the correct email format \uD83D\uDE05\r\n\r\nNo worries, check the example \uD83D\uDC47\r\n---\r\n\u27A1\uFE0F **Example**\r\nadam@gmail.com Adam');
            return;
          }

          msg.reply('That\'s not the correct format \uD83D\uDE05\r\n\r\nNo worries, check the example \uD83D\uDC47\r\n---\r\n\u27A1\uFE0F **Example**\r\nadam@gmail.com Adam');
        }


    }





  }


  if(msg.channel.id=="742483691498110996"&&msg.content=="!joke"){
    if(isTesting=="yes") return;
    msg.channel.startTyping();
    console.log("in joKe");
    fetch("https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist")
  .then(async function(res) {
     console.log("oK");
     jsonres = await res.json();
     if(jsonres.type=="twopart"){
   Embed = new Discord.MessageEmbed()
      .setColor('#31E085')
      .setTitle(jsonres.setup+"\n\n"+jsonres.delivery);
       msg.channel.send(Embed);
     }
     if(jsonres.type=="single"){
      Embed = new Discord.MessageEmbed()
      .setColor('#31E085')
      .setTitle(jsonres.joke);
      msg.channel.send(Embed);
     }
     msg.channel.stopTyping();
    })
  .catch(function(error) {
    msg.channel.send("Something went wrong while fetching joke try again");
    console.log("not oK");
    msg.channel.stopTyping();
  });          
  }

  if(msg.channel.id=="741685834637508669"&&msg.content=="!joke"){
    if(isTesting=="no") return;
    //BOT MEME TESTING CH
    msg.channel.startTyping();
    console.log("in joKe");
    fetch("https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist")
  .then(async function(res) {
     console.log("oK");
     jsonres = await res.json();
     if(jsonres.type=="twopart"){
   Embed = new Discord.MessageEmbed()
      .setColor('#31E085')
      .setTitle(jsonres.setup+"\n\n"+jsonres.delivery);
       msg.channel.send(Embed);
     }
     if(jsonres.type=="single"){
      Embed = new Discord.MessageEmbed()
      .setColor('#31E085')
      .setTitle(jsonres.joke);
      msg.channel.send(Embed);
     }
     msg.channel.stopTyping();
    })
  .catch(function(error) {
    msg.channel.send("Something went wrong while fetching joke try again");
    console.log("not oK");
    msg.channel.stopTyping();
  });      
  }


  if(msg.channel.id=="742483691498110996"&&msg.content=="!meme")
  {  
    if(isTesting=="yes") return;
    console.log("IN");
    msg.channel.startTyping();
    getMEME(subreddits[getRandomInt(subreddits.length)],msg);

  }
  if(msg.channel.id=="741685834637508669"&&msg.content=="!meme")
  {  
    if(isTesting=="no") return;
    //BOT MEME TESTING Ch
    console.log("IN TEST MODE");
    msg.channel.startTyping();
    getMEME(subreddits[getRandomInt(subreddits.length)],msg);
  }
  
}
);

BOT.login(process.env.discord_token);