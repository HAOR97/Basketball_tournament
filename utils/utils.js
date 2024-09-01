

//simulator igre
function simulateBasketballGame(team1, team1FIBARank, team2, team2FIBARank) {
  // Izračunavanje verovatnoće pobede za svaki tim na osnovu njihovih FIBA rankova
  // Niži rang znači bolji tim
  const totalRank = team1FIBARank + team2FIBARank;
  const team1WinProbability = team2FIBARank / totalRank;
  const team2WinProbability = team1FIBARank / totalRank;

  // Generisanje nasumičnog broja između 0 i 1
  const randomValue = Math.random();

  // Određivanje pobednika na osnovu nasumičnog broja i verovatnoće pobede
  let winner;
  let loser;
  if (randomValue < team1WinProbability) {
      winner = team1;
      loser =  team2;
  } else {
      winner = team2;
      loser = team1;
  }
  // Generisanje rezultata 

    let score1 = 0;
    let score2 = 0;
    while(score1 === score2){
      score1 = Math.floor(Math.random() * 75) + 50; // Score između 50 i 150
      score2 = Math.floor(Math.random() * 75) + 50; // Score između 50 i 150
    }

  

  let team1Score;
  let team2Score;
  if(team1 == winner){
    if(score1 > score2){
      team1Score = score1
      team2Score = score2
    }
    else{
      team1Score = score2
      team2Score = score1
    }
  }else{
    
    if(score1 > score2){
      team1Score = score2
      team2Score = score1
    }
    else{
      team1Score = score1
      team2Score = score2
    }
  }

  return {
      winner: winner,
      loser: loser,
      score: {
          [team1]: team1Score,
          [team2]: team2Score
      }
  };
}

function sortTeams(teams) {
  return teams.sort((a, b) => {
    // Sortiranje po broju bodova (više bodova dolazi prvo)
      if (b.scores() !== a.scores()) {
          return b.scores() - a.scores();
      }
      // Ako imaju isti broj bodova, sortiranje po koš razlici (veća razlika dolazi prvo)
      if (b.pointsDifferences() !== a.pointsDifferences()) {
          return b.pointsDifferences() - a.pointsDifferences();
      }
      // Ako imaju isti broj bodova i istu koš razliku, sortiranje po broju postignutih koševa (više koševa dolazi prvo)
      return b.points - a.points;
  });
}

module.exports = {
  simulateBasketballGame,
  sortTeams
};
