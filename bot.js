const Discord = require('discord.js');
const auth = require("./auth.json")
const puppeteer = require('puppeteer');


const client = new Discord.Client();
//https://tracker.gg/valorant/profile/riot/Dinxx%23Zy1/overview


async function fetchData(name, id) { 
  try {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.goto(`https://tracker.gg/valorant/profile/riot/${name}%23${id}/overview`, { waitUntil: 'networkidle2' })
    
    //await page.screenshot({
    //  path: "page1.png"
    //})
    //await page.pdf({ path: 'page2.pdf'})

    const matches = await page.evaluate(() => {
      let matches = [];

      let querySelectors = []

      let matchScoreChildName = `${name}'s Score`
      let matchMap = {parent: document.querySelectorAll('div.match__map'), children: {"Map": "span:nth-child(1)", "Time": "span.match__time"}}
      let matchType = {parent: document.querySelectorAll('div.match__gametype'), children: {"Mode": "div.match__mode"}}
      let matchScore = {parent: document.querySelectorAll('span.stat__value'), children: {[matchScoreChildName]: "span.score--won", "Oppsing Team's Score": "span.score--lost"}}
      let personalMatchStats = {parent: document.querySelectorAll('div.stat'), children: {"K/D/A": "div.value", 
                                                                                          "K/D Ratio": "div.value",
                                                                                          "Damage": "div.value", 
                                                                                          "Avg Score": "div.value"}}
      let titles = {parent: document.querySelectorAll('div.gamereport-list__group'), children: {"Date": "h3.gamereport-list__title", 
                                                                                                "Entries": "div.gamereport-list__entries"}}




      querySelectors.push(matchMap)
      querySelectors.push(matchType)
      querySelectors.push(matchScore)
      querySelectors.push(titles)
      querySelectors.push(personalMatchStats)


      console.log(querySelectors)


      // used to index through all created matches objects in the final list
      let counter = 0;

      let b = []

      let date = []
      let entries = []

      for (var i in querySelectors){
        let parent = querySelectors[i].parent
        let children = querySelectors[i].children
        

        let personalStatsList = []
        
        

        parent.forEach((historyElement) => {
          //console.log("elm")
          //console.log(historyElement)
          if (i > 0){
            try{
              for (const [key, value] of Object.entries(children)){              

                if (key == "K/D/A" || key == "K/D Ratio" || key == "Damage" || key == "Avg Score"){
                  let content = historyElement.querySelector(value).textContent
                  personalStatsList.push(content)
                  break;
                } else if (key == "Date"){
                  console.log("in date")
                  let content = historyElement.querySelector(value).textContent
                  date.push(content)
                } else if (key == "Entries"){
                  console.log("in entries")
                  let content = historyElement.querySelector(value).textContent
                  entries.push(content)
                } else{
                  let content = historyElement.querySelector(value).textContent

                  if (key == "Mode"){
                    content = content.replace(/\s/g, '')
                  }

                  matches[counter][key] = content;
                }
              }
              counter ++
            } 
            catch (error) {
              console.log(error)
              console.log("Didnt work 1")
            }
          } else {
            let historyJson = {}
            try{
              for (const [key, value] of Object.entries(children)){
                let content = historyElement.querySelector(value).textContent
                
                if (key == "Mode"){
                  content = content.replace(/\s/g, '')
                }
                historyJson[key] = content
              }  
            }
              
            catch (error) {
              console.log("Didnt work")
            }
            matches.push(historyJson)
          }

        })
        
        // Date logic
        counter5 = 0
        dateCounter = 0
        entries.forEach((entry) => {

          let len = (entry.match(/Damage/g) || []).length
          console.log(`len = ${len}`)
          
          for (let n=0; n < len; n++) {
            console.log(`date = ${date}`)
            console.log(`date[counter5] = ${date[counter5]}`)
            console.log(`counter5 = ${counter5}`)
            matches[dateCounter]["Date"] = date[counter5]
            dateCounter ++ 
          }
          counter5 ++
          
        })




        // Reset counter...
        counter = 0

        //console.log(personalStatsList)
        
        // Special condition for match stats
        let test = [0,1,2,3]
        let test2 = ["K/D/A", "K/D Ratio", "Damage", "Avg Score"]
        counter2 = -1
        for (var j in matches) {
          //console.log(j)
          counter2 ++
          counter3 = -1
          for (var k in test) {
            counter3 ++
            //console.log(k)
            //console.log("2")
            matches[counter2][test2[counter3]] = personalStatsList[0]
            //console.log(matches)
            personalStatsList.splice(0, 1)
          }
        }
      }

        
      console.log("matches = ")
      console.log(matches)
      return matches
    })

    //console.log(JSON.stringify(teams, null, 2))
    console.log("\n ------------------------------------------------------")
    console.log(matches)
    console.log("done")
    return matches
    //await browser.close()
  } catch (error) {
    console.log(error)
  }
}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.id != "753119817296248904") {
    if (msg.content.substring(0,1) === "?") {
      var messageContent = msg.content.substring(1, msg.content.length)
      var messageContentList = messageContent.split(" ")
      var keyword = messageContentList[0]
      switch(keyword) {
        case "history":
          var name = messageContentList[1]
          var hash = messageContentList[2]
          fetchData(name, hash).then(value => {

            if (value.length == 0 || value.length == null) {
              msg.reply("This account does not have any recent matches or your Riot account is private!!!")
            }

            //var stringify = JSON.stringify(value)
            var gameCounter = 1
            for (var game in value) {
              var info = ""
              for (const [key, val] of Object.entries(value[game])) {
                //console.log(JSON.stringify(game))
                info += ` - ${key}: ${val}\n`
              }
              info += "----------------------------------------"

              msg.reply(`-------------------- Game ${gameCounter} --------------------\n${info}`)
              gameCounter ++
            }
            //var map = value[0].map
            
            
          }).catch(error => {
            console.log(error)
            // if you have an error
          })
          


          /*
          async () => {
            const browser = await puppeteer.launch({
            headless: false,
          });
          const page = await browser.newPage();
          await page.setRequestInterception(true);
          await page.goto('http://www.google.com/');
          }
          console.log("page")
          console.log(page)
          */
      }

    } else {
      null
    }
  }
});

client.login(auth.token);














