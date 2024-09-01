//ispravi kada tri tima imaju isto bodova gleda se pointdifference a ako dva imaju medjusobni skor to je u klasi GRoup


const {Team,Group} = require('./Class')
const groups = require("./data/groups.json");
const {groupStageGenerator, groupTableShow} = require('./Stages/groupStageController.js')
const {sortTeams,simulateBasketballGame} = require('./utils/utils.js')

//da ne bi prolazio dva puta kroz niz ista funkcija pravi i svi timmovi
function makeTeamsArrayAndGroupsArray(data) {
    const teamsArray = [];
    const groupAll = [] 
    // Iteriraj kroz svaki par [key, value] u objektu data
    for (const [group, teams] of Object.entries(data)) {
        
        //postavlja novu grupu u groupfinall ukoliko ne postoji 
        if(!groupAll.find(t => t.name === group)){
            groupAll.push(new Group(group))
        }
        
        teams.forEach(teamData => {
            // Kreiraj novu instancu klase Team
            const team = new Team(teamData.Team, teamData.ISOCode, teamData.FIBARanking);
            
            
            // Postavi grupu za tim
            team.group = group;
            
            // Dodaj instancu u niz
            teamsArray.push(team);
            
            //povezuje s tim sa grupom preko reference
            groupAll.find((g)=> g.Name === group).Teams.push(team)
        });
    }
    
    return [teamsArray,groupAll];
}


const [teams,groupAll] = makeTeamsArrayAndGroupsArray(groups);


//@ GROUP STAGE
groupTableShow(groups)
groupStageGenerator(groups,teams,groupAll);

const table = {
    to3 : [],
    to6 : [],
    to9 : [],
    svi:[]
}

// Sortiranje timova po plasmanu u grupi i ubacivanje u table objekat po 3 tima svaki element
console.log("Plasman po Grupama:")
groupAll.forEach(g=>{
    g.rangList()
    console.log(`    Grupa ${g.Name}:`)
    g.Teams.forEach((t,index)=>{

        //raspored u tabelu
        if(index === 0 ){
            table.to3.push(t)
        }
        else if( index === 1){
            table.to6.push(t)
        }
        else if( index === 2){
            table.to9.push(t)
        }

        function padString(string, length) {
            return string + ' '.repeat(length - string.length);
        }
        console.log(`       ${index+1}. ${padString(t.Team, 20)}  ${t.wins} / ${t.loses} / ${t.scores()} / ${t.points} / ${t.recivePoints} / ${t.pointsDifferences()}`)

    })
})


Object.values(table).forEach(sortTeams)


//sesiri rucno
const pots = {
    D:[table.to3[0],table.to3[1]],
    E:[table.to3[2],table.to6[0]],
    F:[table.to6[1],table.to6[2]],
    G:[table.to9[0],table.to9[1]]
}
// Pravljenje parova od dva sesira koja biras
function matchPairing(pots, hat1, hat2) {
    let alreadySet = false;
    
    const pairs = {
        par1:[],
        par2:[]
    }
    
    pots[hat1].forEach((t, index) => {
        const match = pots[hat2].find(t2 => t.group === t2.group);
        if (match) {
            alreadySet = true
            pairs.par1.push(t);
            pairs.par2.push(match);
            pots[hat1].splice(index, 1);
            pots[hat2].splice(pots[hat2].indexOf(match), 1);
            pairs.par1.push(pots[hat2][0]);
            pairs.par2.push(pots[hat1][0]);
        }
    });
    
    // Ako nema timova iz iste grupe, formiraj nasumične parove
    if (!alreadySet) {
        const indexOfRnd = Math.floor(Math.random() * 2);
        pairs.par1.push(pots[hat1][0])
        pairs.par2.push(pots[hat1][1])
        pairs.par1.push(pots[hat2][indexOfRnd])
        const secondIndex = (indexOfRnd === 1) ? 0 : 1;
        pairs.par2.push(pots[hat2][secondIndex])
        
    }

    return pairs
}

//pravljenje parova od sesira
const pairs = {
    par1:[],
    par2:[],
    par3:[],
    par4:[]

}
const pairsDG = matchPairing(JSON.parse(JSON.stringify(pots)), 'D', 'G');
pairs.par1.push(pairsDG.par1[0],pairsDG.par1[1])
pairs.par2.push(pairsDG.par2[0],pairsDG.par2[1])
const pairsEF = matchPairing(JSON.parse(JSON.stringify(pots)), 'E', 'F', 'par3', 'par4');
pairs.par3.push(pairsEF.par1[0],pairsEF.par1[1])
pairs.par4.push(pairsEF.par2[0],pairsEF.par2[1])

//prikaz eliminacione faze
console.log("\Eliminaciona faza:")
Object.keys(pairs).forEach(key =>{

    console.log("    ",pairs[key][0].Team," - ",pairs[key][1].Team)
})

//prolazak kroz parove, simulacija utakmica,upis utakmica i prikaz
function nextPhase(objPairs){
    const winPairs = {
        par1:[],
        par2:[]
    }
    const losers = {
        par1:[]
    }
    
    Object.keys(objPairs).forEach((key,index)=>{
        objPairs[key].push(simulateBasketballGame(objPairs[key][0].ISOCode,objPairs[key][0].FIBARanking,objPairs[key][1].ISOCode,objPairs[key][1].FIBARanking))
        console.log(`    ${objPairs[key][0].Team} - ${objPairs[key][1].Team}`)
        //raspored rezultata tako da rezultat tako da pravi rezultat stoji ispod pravog tima
        let winnerTeam ;
        let loserTeam ;
        if(objPairs[key][2].winner === objPairs[key][0].ISOCode){
            winnerTeam = objPairs[key][0]
            loserTeam = objPairs[key][1]
        }else{
            winnerTeam = objPairs[key][1]
            loserTeam = objPairs[key][0]
        }
        console.log(`    ${objPairs[key][2].score[objPairs[key][0].ISOCode]} - ${objPairs[key][2].score[objPairs[key][1].ISOCode]}\n`)
        
        if(index == 0 || index == 1){
            winPairs.par1.push(winnerTeam)
        }else{
            winPairs.par2.push(winnerTeam)
        }
        losers.par1.push(loserTeam)
        
    })
    
    //kod finala samo jedan tim je u gubitnickim
    if(winPairs.par2.length < 1){
        delete winPairs.par2;
    }

    return [winPairs,losers]
}

console.log("\nCetvrtfinale:\n")
const [semiFinal,losers] = nextPhase(pairs)

console.log("\nPolufinale:\n")
const [final,forThirdPlace] = nextPhase(semiFinal)
//console.log("loseri:",ZaTreceMesto)


console.log("\nZa trece mesto:\n")
const [thirdPlace] = nextPhase(forThirdPlace)

console.log("\nFinale:\n")
const [firstPlace,secondPlace] = nextPhase(final)

console.log(`1.${firstPlace.par1[0].Team}\n2.${secondPlace.par1[0].Team}\n3.${thirdPlace.par1[0].Team}\n`)



