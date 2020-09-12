const Discord = require('discord.js');
const auth = require("./auth.json")
const puppeteer = require('puppeteer');


const client = new Discord.Client();
//https://tracker.gg/valorant/profile/riot/Dinxx%23Zy1/overview


(async () => {
  try {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.goto("https://tracker.gg/valorant/profile/riot/Dinxx%23Zy1/overview", { waitUntil: 'networkidle2' })
    
    //await page.screenshot({
    //  path: "page1.png"
    //})
    //await page.pdf({ path: 'page2.pdf'})

    const matches = await page.evaluate(() => {
      let matches = [];

      let querySelectors = []

      let matchMap = {parent: document.querySelectorAll('div.match__map'), children: {map: "span:nth-child(1)", time: "span.match__time"}}
      let matchType = {parent: document.querySelectorAll('div.match__gametype'), children: {mode: "div.match__mode"}}
      let matchScore = {parent: document.querySelectorAll('span.stat__value'), children: {won: "span.score--won", lost: "span.score--lost"}}
      let personalMatchStats = {parent: document.querySelectorAll('div.stat'), children: {"K/D/A": "div.value", 
                                                                                          "K/D Ratio": "div.value",
                                                                                          "Damage": "div.value", 
                                                                                          "Avg Score": "div.value"}}



      querySelectors.push(matchMap)
      querySelectors.push(matchType)
      querySelectors.push(matchScore)
      querySelectors.push(personalMatchStats)

      console.log(querySelectors)


      // used to index through all created matches objects in the final list
      let counter = 0;

      let b = []


      for (var i in querySelectors){
        let parent = querySelectors[i].parent
        let children = querySelectors[i].children
        console.log("matches")
        console.log(matches)

        let personalStatsList = []

        parent.forEach((historyElement) => {
          console.log("elm")
          console.log(historyElement)
          if (i > 0){
            try{
              for (const [key, value] of Object.entries(children)){
                if (key == "K/D/A" || key == "K/D Ratio" || key == "Damage" || key == "Avg Score"){
                  let content = historyElement.querySelector(value).textContent
                  personalStatsList.push(content)
                  break;
                } else{
                  let content = historyElement.querySelector(value).textContent
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
                historyJson[key] = content
              }  
            }
              
            catch (error) {
              console.log("Didnt work")
            }
            matches.push(historyJson)
          }
          

        })

        counter = 0

        console.log(personalStatsList)
        
        
    
        let test = [0,1,2,3]
        let test2 = ["K/D/A", "K/D Ratio", "Damage", "Avg Score"]
        counter2 = -1
        for (var j in matches) {
          console.log(j)
          counter2 ++
          counter3 = -1
          for (var k in test) {
            counter3 ++
            console.log(k)
            console.log("2")
            matches[counter2][test2[counter3]] = personalStatsList[0]
            console.log(matches)
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
    //await browser.close()
  } catch (error) {
    console.log(error)
  }
})()



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.id != "753119817296248904") {
    if (msg.content.substring(0,1) === "?") {
      var messageContent = msg.content.substring(1, msg.content.length)

      switch(messageContent) {
        case "history":
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














