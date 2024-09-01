


function groupStageGenerator(groups,teams,groupAll) {

  const { simulateBasketballGame } = require('../utils/utils')

  const generatedGames = Object.entries(groups).map((group) => {
    //GENERATES MATCHES BY ROUNDS
    const nazivGrupe = group[0];
    let timovi = group[1];
    let utakmice = [];
    let brojTimova = timovi.length;

    // Proveri da li ima paran broj timova
    if (brojTimova % 2 !== 0) {
      throw new Error("Broj timova mora biti paran.");
    }

    // Round-robin raspored
    for (let i = 0; i < brojTimova - 1; i++) {
      let kolo = [];
      for (let j = 0; j < brojTimova / 2; j++) {
        let domacin = timovi[j];
        let gost = timovi[brojTimova - 1 - j];
        kolo.push([domacin, gost]);
        //console.log("kolo je", kolo);
      }

      // Rotiraj timove (osim prvog)
      timovi = [timovi[0], ...timovi.slice(-1), ...timovi.slice(1, -1)];

      utakmice.push(kolo);
    }
    return { nazivGrupe, utakmice };
  });
  
   generatedGames.forEach((grupe) => {
    grupe.utakmice.forEach((utakmiceUgrupiPoKolu)=>{
      utakmiceUgrupiPoKolu.forEach((pojedanacnoUtakmice) => {
        
        const result = simulateBasketballGame(pojedanacnoUtakmice[0].ISOCode,pojedanacnoUtakmice[0].FIBARanking,pojedanacnoUtakmice[1].ISOCode,pojedanacnoUtakmice[1].FIBARanking)
        pojedanacnoUtakmice.push(result)
      })
    })
  })

  const gamesAndResults = generatedGames


  //prolazak kroz svaku utakmicu i prikaz
  gamesAndResults.forEach((grupe) => {
    console.log(`\nGrupa ${grupe.nazivGrupe}:\n`)
    grupe.utakmice.forEach((utakmiceUgrupiPoKolu,index)=>{
      groupAll.find((g) => g.Name === grupe.nazivGrupe).Games.push(utakmiceUgrupiPoKolu)
      console.log(`    Kolo broj ${index+1}:\n`)
      utakmiceUgrupiPoKolu.forEach((pojedanacnoUtakmice) => {
        console.log(`         ${pojedanacnoUtakmice[0].Team} - ${pojedanacnoUtakmice[1].Team}`)


        // console.log(pojedanacnoUtakmice)
        //belezenje rezultata u objetak teams
        teams.find(team => {
          if(team.ISOCode === pojedanacnoUtakmice[2].winner){
            team.wins +=1;
            
            team.points += pojedanacnoUtakmice[2].score[team.ISOCode]
            //dodavanje poena i recivePoints
            Object.keys(pojedanacnoUtakmice[2].score).forEach(ISOCode=>{
              if(ISOCode !== team.ISOCode){
                team.recivePoints += pojedanacnoUtakmice[2].score[ISOCode]
              }
            })
            
          }
          else if(team.ISOCode === pojedanacnoUtakmice[2].loser){
            team.loses +=1
            
            team.points += pojedanacnoUtakmice[2].score[team.ISOCode]
            //dodavanje poena i recivePoints
            Object.keys(pojedanacnoUtakmice[2].score).forEach(ISOCode=>{
              if(ISOCode !== team.ISOCode){
                team.recivePoints += pojedanacnoUtakmice[2].score[ISOCode]
              }
            })
          }
        })


        //ispis u konzoli
        if(pojedanacnoUtakmice[0].ISOCode == Object.values(pojedanacnoUtakmice[2].score)[0]){
          console.log(`         ${Object.values(pojedanacnoUtakmice[2].score)[1]} - ${Object.values(pojedanacnoUtakmice[2].score)[0]}`)
        }
        else{
          console.log(`         ${Object.values(pojedanacnoUtakmice[2].score)[0]} - ${Object.values(pojedanacnoUtakmice[2].score)[1]}`)
        }
        console.log("\n")
      })
    })
  })


  return gamesAndResults;
}


//SHOW TABLE BEFOR GAME
function groupTableShow(groups) {
  Object.entries(groups).map((group) => {
    console.log(`Group ${group[0]}: \n`);
    group[1].forEach((t) => {
      console.log(`    ${t.Team}`);
    });
    console.log("\n");
  });
}




module.exports = {
  groupStageGenerator,
  groupTableShow
};
