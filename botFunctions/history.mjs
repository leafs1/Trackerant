import puppeteer from 'puppeteer';

export default async function fetchHistory(name, id) { 
    try {
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      })
      const page = await browser.newPage()
      await page.goto(`https://tracker.gg/valorant/profile/riot/${name}%23${id}/overview`, { waitUntil: 'networkidle2' })
      
      //await page.screenshot({
      //  path: "page1.png"
      //})
      //await page.pdf({ path: 'page2.pdf'})
  
      const matches = await page.evaluate(() => {
        let matches = [];
  
        let querySelectors = []
  
        let matchScoreChildName = `Your Team's Score`
        let matchMap = {parent: document.querySelectorAll('div.match__map'), children: {"Map": "span:nth-child(1)", "Time": "span.match__time"}}
        let matchType = {parent: document.querySelectorAll('div.match__gametype'), children: {"Mode": "div.match__mode"}}
        let matchScore = {parent: document.querySelectorAll('span.stat__value'), children: {[matchScoreChildName]: "span.score--won", "Opposing Team's Score": "span.score--lost"}}
        let personalMatchStats = {parent: document.querySelectorAll('div.stat'), children: {"K/D/A": "div.value", 
                                                                                            "K/D Ratio": "div.value",
                                                                                            "Damage": "div.value", 
                                                                                            "Avg Score": "div.value"}}
        let titles = {parent: document.querySelectorAll('div.gamereport-list__group'), children: {"Date": "h3.gamereport-list__title", 
                                                                                                  "Entries": "div.gamereport-list__entries"}}
        let agent = {parent: document.querySelectorAll('div.match__details'), children: {"Agent": "img.match__agent"}}                                                                                            
  //img.match__agent
  
  
  
        querySelectors.push(matchMap)
        querySelectors.push(matchType)
        querySelectors.push(matchScore)
        querySelectors.push(titles)
        querySelectors.push(agent)
        querySelectors.push(personalMatchStats)
  
        console.log(querySelectors)
  
  
        // used to index through all created matches objects in the final list
        let counter = 0;
  
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
                    } else if (key == "Agent") {
                      content = historyElement.querySelector(value).getAttribute('src')
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

