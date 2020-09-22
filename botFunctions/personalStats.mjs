import puppeteer from 'puppeteer';

export default async function fetchPersonalStats(name, id) { 
    try {
        const browser = await puppeteer.launch({
          headless: true,
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
    
        const pageData = await page.evaluate(() => {
            console.log("bs")
            let stats = [];
            console.log("as")
            let querySelectors = [];

            let rank = {parent: document.querySelectorAll('div.highlighted-stat'), children: {"Icon": "img.rank-icon", 
                                                                                              "Rank": "div.text"}}

            querySelectors.push(rank)

            let counter = 0;
            for (var i in querySelectors){
                let parent = querySelectors[i].parent
                let children = querySelectors[i].children

                parent.forEach((historyElement) => {
                    //console.log("elm")
                    //console.log(historyElement)
                    if (i > 0){
                        try{
                            for (const [key, value] of Object.entries(children)){
                                if (key == "Icon") {
                                    let content = historyElement.querySelector(value).getAttribute("src")
                                    stats[counter][key] = content;

                                } else {
                                    let content = historyElement.querySelector(value).textContent
                                    stats[counter][key] = content;

                                }

                            }
                            counter ++
                        }
                        catch (e) {
                            console.log(e)
                        }   
                    } else {
                        let historyJson = {}
                        try{
                          for (const [key, value] of Object.entries(children)){
                            if (key == "Icon") {
                                let content = historyElement.querySelector(value).getAttribute("src")
                                historyJson[key] = content

                            } else {
                                let content = historyElement.querySelector(value).textContent
                                historyJson[key] = content
                            }                 
                          }  
                        }
                          
                        catch (error) {
                          console.log("Didnt work")
                        }
                        stats.push(historyJson)
                        console.log(stats)
                        console.log(JSON.stringify(stats))
                    }
                })
                        
            }
        //console.log(`inside stats = ${JSON.stringify(stats)}`)
        return stats
    })
        return pageData
    } catch (e) {
        console.log(`Error = ${e}`)
    } 
    
}
        