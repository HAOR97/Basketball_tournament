class Team {
    constructor(Team, ISOCode, FIBARanking) {
        this.Team = Team;
        this.ISOCode = ISOCode;
        this.FIBARanking = FIBARanking;
        this.wins = 0;
        this.loses = 0;
        this.group = null;
        this.points = 0;
        this.recivePoints = 0;
    }

    scores() {
        return this.wins * 2 + this.loses * 1;
    }

    pointsDifferences() {
        return this.points - this.recivePoints;
    }
}

class Group {
    constructor(name) {
        this.Name = name;
        this.Teams = [];
        this.Games = [];
    }
    rangList() {
        // Sort teams based on points
        this.Teams.sort((a, b) => b.scores() - a.scores());

        for (let i = 0; i < this.Teams.length - 1; i++) {
            let currentTeam = this.Teams[i];
            let nextTeam = this.Teams[i + 1];

            // If two teams have the same points
            if (currentTeam.scores() === nextTeam.scores()) {
                let headToHeadGame = null;
            
                // Prolazi kroz sve grupe
                for (const group of this.Games) {
                    // Prolazi kroz sve utakmice u svakoj grupi
                    for (const game of group) {
                        if ((game[0].ISOCode === currentTeam.ISOCode && game[1].ISOCode === nextTeam.ISOCode) ||
                            (game[0].ISOCode === nextTeam.ISOCode && game[1].ISOCode === currentTeam.ISOCode)) {
                            headToHeadGame = game;
                            break; // Pronađena je utakmica, možeš prekinuti pretragu
                        }
                    }
            
                    if (headToHeadGame) {
                        break; // Ako je utakmica pronađena, izlazi iz spoljašnje petlje
                    }
                }

                if (headToHeadGame) {
                    // Assuming game[2] holds the result as an object with keys 'winner' and 'loser'
                    let winner = headToHeadGame[2].winner;
                    if (winner === nextTeam.ISOCode) {
                        // Swap teams if the next team won the head-to-head game
                        [this.Teams[i], this.Teams[i + 1]] = [nextTeam, currentTeam];
                    }
                }
            }
        }

        // Handle tie with three teams having the same points
        for (let i = 0; i < this.Teams.length - 2; i++) {
            let t1 = this.Teams[i];
            let t2 = this.Teams[i + 1];
            let t3 = this.Teams[i + 2];

            if (t1.scores() === t2.scores() && t2.scores() === t3.scores()) {
                let gamesBetween = this.Games.filter(game =>
                    (game[0] === t1 && game[1] === t2) ||
                    (game[0] === t2 && game[1] === t3) ||
                    (game[0] === t3 && game[1] === t1) ||
                    (game[0] === t2 && game[1] === t1) ||
                    (game[0] === t3 && game[1] === t2) ||
                    (game[0] === t1 && game[1] === t3)
                );

                // Calculate point differences between these three teams
                let pointsDiff1 = t1.pointsDifferences();
                let pointsDiff2 = t2.pointsDifferences();
                let pointsDiff3 = t3.pointsDifferences();

                // Sort these three teams by point difference
                let teams = [t1, t2, t3];
                teams.sort((a, b) => {
                    if (a.pointsDifferences() === b.pointsDifferences()) {
                        // If the point difference is the same, we could add additional logic here
                        return 0;
                    }
                    return b.pointsDifferences() - a.pointsDifferences();
                });

                // Update the ranking order
                this.Teams.splice(i, 3, ...teams);
            }
        }
    }
    
}

module.exports = {
    Team,
    Group
}