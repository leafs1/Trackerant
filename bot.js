import Discord from 'discord.js';
//const auth = require("./config.json")
//const puppeteer = require('puppeteer');

import fetchHistory from './botFunctions/history.mjs'
import fetchPersonalStats from './botFunctions/personalStats.mjs'

//const fetchData = require('./botFunctions/history.js')


const client = new Discord.Client();
//https://tracker.gg/valorant/profile/riot/Dinxx%23Zy1/overview

client.login("NzU3MTE2MTE4NjM5ODM3MjM1.X2btVQ.oe-V5T4vorkZmmyPBVW8udyJ_nE")
//client.login(process.env.BOT_TOKEN)






client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.id != "757116118639837235") {
    if (msg.content.substring(0,1) === "?") {
      var messageContent = msg.content.substring(1, msg.content.length)
      var messageContentList = messageContent.split(" ")
      var keyword = messageContentList[0]
      console.log(`Keyword = ${keyword}`)

      switch(keyword) {
        case "history":
          console.log("History Case")
          msg.reply("Getting Info...")
          var name = messageContentList[1]
          var hash = messageContentList[2]
          var numGames = messageContentList[3]
          fetchHistory(name, hash, numGames).then(beforeValue => {

          //  value = value.splice(Number(numGames)-1, value.length - Number(numGames))
            if (numGames == "all") {
              value = beforeValue
            } else {
              value = beforeValue.splice(0, Number(numGames))
            }


            if (value.length == 0 || value.length == null) {
              const publicizeEmbed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(`This account does not have any recent matches or your Riot account is private!!! To publicize your account, click [here](https://tracker.gg/valorant/profile/riot/${name}%23${hash}/overview)`)
              msg.reply(publicizeEmbed)
            }

                        
            //var stringify = JSON.stringify(value)
            var gameCounter = 1
            for (var game in value) {
              //for (const [key, val] of Object.entries(value[game])) {
              let currentMapImg = ""
              if (value[game]["Map"] == "Haven") {
                currentMapImg = "https://vignette.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png/revision/latest?cb=20200620202335"
              } else if (value[game]["Map"] == "Bind") {
                currentMapImg = "https://vignette.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png/revision/latest?cb=20200620202316"
              } else if (value[game]["Map"] == "Split") {
                currentMapImg = "https://vignette.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png/revision/latest?cb=20200620202349"
              } else if (value[game]["Map"] == "Ascent") {
                currentMapImg = "https://vignette.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png/revision/latest?cb=20200607180020"
              }

              let winLoss = ""
              if (value[game]["Your Team's Score"] > value[game]["Oppsing Team's Score"]) {
                winLoss = "#008000"
              } else if (value[game]["Your Team's Score"] < value[game]["Oppsing Team's Score"]) {
                winLoss = "#FF0000"
              } else {
                winLoss = "#FFFF00"
              }

              const historyEmbed = new Discord.MessageEmbed()
                //.setColor('#0099ff')
                .attachFiles(['./assets/TRACKERANT.png'])
                .setColor(winLoss)
                .setTitle(`*__${value[game]["Date"]} - ${value[game]["Time"]}__*`)
                .setDescription(`${value[game]["Mode"]} - ${value[game]["Your Team's Score"]} : ${value[game]["Oppsing Team's Score"]}`)
                //.setURL('https://discord.js.org/')
                .setAuthor('Trackerant', 'attachment://TRACKERANT.png', 'https://github.com/leafs1/Trackerant')
                .addFields(
                  //{ name: `Mode`, value: `${value[game]["Mode"]}`, inline: true},
                  //{ name: `Game Score`, value: `${value[game]["Your Team's Score"]} : ${value[game]["Oppsing Team's Score"]}`, inline: true },
                )
                .setThumbnail(value[game]["Agent"])
                .addFields(
                  
                  [{ name: '\u200B', value: '\u200B' },
                  { name: 'K/D/A', value: `${value[game]["K/D/A"]}`, inline: true },
                  { name: 'K/D Ratio', value: `${value[game]["K/D Ratio"]}`, inline: true },
                  { name: 'Damage', value: `${value[game]["Damage"]}`, inline: true },
                  { name: 'Avg Score', value: `${value[game]["Avg Score"]}`, inline: true }]
                )
                .setImage(currentMapImg)
                .setTimestamp()
                //.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
                //console.log(JSON.stringify(game))
              //  info += ` - ${key}: ${val}\n`
              //}

              msg.reply(historyEmbed)
              gameCounter ++
            }
            
            //var map = value[0].map
            
            
          }).catch(error => {
            console.log(error)
            // if you have an error
          })
          


        case "help":
          if (keyword == "help") {
            console.log("Help case")
            const helpEmbed = new Discord.MessageEmbed()
              .setTitle("Help")
              .setDescription("Hey, I'm Trackerant!!! I can get u any information you want on various Valorant accounts.\n```1. To get your match history, type in \"?history <name> <tag> <number of games>\". For exaxmple, \"?history Dinxx Zy1 3\" or \"?history Dinxx Zy1 all\".```")
            msg.reply(helpEmbed)
          }

        case "test":
          if (keyword == "test") {
            console.log("test case")
            var name = messageContentList[1]
            var hash = messageContentList[2]
            fetchPersonalStats(name, hash).then(stats => {
              console.log(stats)
            })
          }
          
      }

    } else {
      null
    }
  }
});
//client.login(process.env.BOT_TOKEN);
