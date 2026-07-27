// Tournament Generator App
const TournamentApp = {
    state: {
        tournamentType: null,
        tournamentName: '',
        players: [],
        matches: [],
        standings: [],
        roundCount: 1,
        hasKnockoutFinals: false,
        teamsAdvancing: 4,
        currentRound: 1,
        knockoutMatches: [],
    },

    init() {
        this.loadFromStorage();
        this.attachEventListeners();
    },

    attachEventListeners() {
        // Tournament type selection
        document.querySelectorAll('.tournament-option').forEach(el => {
            el.addEventListener('click', () => this.selectTournamentType(el));
        });

        // Input tabs
        document.querySelectorAll('.input-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e));
        });

        // Player management
        document.getElementById('addPlayerBtn').addEventListener('click', () => this.addPlayer());
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPlayer();
        });
        document.getElementById('importPlayersBtn').addEventListener('click', () => this.importPlayers());
        document.getElementById('clearPlayersBtn').addEventListener('click', () => this.clearPlayers());
        document.getElementById('randomizeBtn').addEventListener('click', () => this.randomizePlayers());

        // Form submission
        document.getElementById('tournamentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startTournament();
        });

        // Tournament controls
        document.getElementById('loadBtn').addEventListener('click', () => this.loadSavedTournament());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTournament());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteTournament());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTournament());

        // Modal controls
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('submitScoreBtn').addEventListener('click', () => this.submitScore());
    },

    selectTournamentType(el) {
        document.querySelectorAll('.tournament-option').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        this.state.tournamentType = el.dataset.type;

        // Show/hide round robin options
        const rrOptions = document.getElementById('roundRobinOptions');
        if (el.dataset.type === 'round-robin') {
            rrOptions.style.display = 'block';
        } else {
            rrOptions.style.display = 'none';
        }
    },

    switchTab(e) {
        e.preventDefault();
        const tabName = e.target.dataset.tab;
        document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.input-content').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        document.querySelector(`[data-tab="${tabName}"].input-content`).classList.add('active');
    },

    addPlayer() {
        const input = document.getElementById('playerName');
        const name = input.value.trim();

        if (!name) {
            this.showError('Please enter a player name');
            return;
        }

        if (this.state.players.length >= 64) {
            this.showError('Maximum 64 players allowed');
            return;
        }

        if (this.state.players.some(p => p.toLowerCase() === name.toLowerCase())) {
            this.showError('Player already added');
            return;
        }

        this.state.players.push(name);
        input.value = '';
        this.renderPlayerList();
    },

    importPlayers() {
        const text = document.getElementById('playerList').value;
        if (!text.trim()) {
            this.showError('Please paste some player names');
            return;
        }

        const separator = text.includes(',') ? ',' : '\n';
        const names = text
            .split(separator)
            .map(n => n.trim())
            .filter(n => n)
            .slice(0, 64 - this.state.players.length);

        const duplicates = names.filter(n =>
            this.state.players.some(p => p.toLowerCase() === n.toLowerCase())
        );

        if (duplicates.length > 0) {
            this.showError(`Skipped duplicates: ${duplicates.join(', ')}`);
        }

        const newPlayers = names.filter(n =>
            !this.state.players.some(p => p.toLowerCase() === n.toLowerCase())
        );

        this.state.players.push(...newPlayers);
        document.getElementById('playerList').value = '';
        this.renderPlayerList();
    },

    clearPlayers() {
        if (confirm('Remove all players?')) {
            this.state.players = [];
            this.renderPlayerList();
        }
    },

    randomizePlayers() {
        for (let i = this.state.players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.state.players[i], this.state.players[j]] = [this.state.players[j], this.state.players[i]];
        }
        this.renderPlayerList();
    },

    renderPlayerList() {
        const container = document.getElementById('playersList');
        const count = document.getElementById('playerCount');

        count.textContent = this.state.players.length;

        if (this.state.players.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-400);">No players added yet</p>';
            return;
        }

        container.innerHTML = this.state.players.map((player, idx) => `
            <div class="player-item">
                <span>${idx + 1}. ${player}</span>
                <button type="button" class="btn-danger btn-small" onclick="TournamentApp.removePlayer(${idx})">Remove</button>
            </div>
        `).join('');
    },

    removePlayer(idx) {
        this.state.players.splice(idx, 1);
        this.renderPlayerList();
    },

    startTournament() {
        const name = document.getElementById('tournamentName').value.trim();

        if (!this.state.tournamentType) {
            this.showError('Please select a tournament type');
            return;
        }

        if (this.state.players.length < 2) {
            this.showError('Add at least 2 players');
            return;
        }

        this.state.tournamentName = name || `${this.state.tournamentType} Tournament`;

        // Get Round Robin options
        if (this.state.tournamentType === 'round-robin') {
            this.state.roundCount = parseInt(document.querySelector('input[name="roundCount"]:checked').value) || 1;
            this.state.hasKnockoutFinals = document.getElementById('knockoutFinals').checked;
            this.state.teamsAdvancing = parseInt(document.getElementById('teamsAdvancing').value);
        }

        switch (this.state.tournamentType) {
            case 'knockout':
                this.generateKnockout();
                break;
            case 'league':
                this.generateLeague();
                break;
            case 'round-robin':
                this.generateMultiRoundRobin();
                break;
        }

        this.saveToStorage();
        this.showTournament();
    },

    generateKnockout() {
        const players = [...this.state.players];
        const matches = [];
        let round = 1;

        while (players.length > 1) {
            const roundMatches = [];
            for (let i = 0; i < players.length; i += 2) {
                if (i + 1 < players.length) {
                    roundMatches.push({
                        id: `${round}-${roundMatches.length}`,
                        round,
                        player1: players[i],
                        player2: players[i + 1],
                        score1: null,
                        score2: null,
                        winner: null,
                        completed: false,
                    });
                } else {
                    roundMatches.push({
                        id: `${round}-${roundMatches.length}`,
                        round,
                        player1: players[i],
                        player2: 'BYE',
                        score1: null,
                        score2: null,
                        winner: players[i],
                        completed: true,
                    });
                }
            }

            matches.push(...roundMatches);
            players.splice(0, Math.min(2, players.length));
            round++;
        }

        this.state.matches = matches;
    },

    generateLeague() {
        const matches = [];
        const players = this.state.players;

        players.forEach((p1, i) => {
            players.forEach((p2, j) => {
                if (i < j) {
                    matches.push({
                        id: `${i}-${j}`,
                        player1: p1,
                        player2: p2,
                        score1: null,
                        score2: null,
                        completed: false,
                    });
                }
            });
        });

        this.state.matches = matches;
        this.updateLeagueStandings();
    },

    generateRoundRobin() {
        this.generateLeague();
    },

    generateMultiRoundRobin() {
        const matches = [];
        const players = this.state.players;

        // Generate matches for each round
        for (let round = 1; round <= this.state.roundCount; round++) {
            players.forEach((p1, i) => {
                players.forEach((p2, j) => {
                    if (i < j) {
                        matches.push({
                            id: `R${round}-${i}-${j}`,
                            round,
                            player1: p1,
                            player2: p2,
                            score1: null,
                            score2: null,
                            completed: false,
                        });
                    }
                });
            });
        }

        this.state.matches = matches;
        this.state.currentRound = 1;
        this.updateLeagueStandings();
    },

    updateLeagueStandings() {
        const standings = this.state.players.map(p => ({
            player: p,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            points: 0,
        }));

        this.state.matches.forEach(match => {
            if (match.completed && match.score1 !== null && match.score2 !== null) {
                const p1 = standings.find(s => s.player === match.player1);
                const p2 = standings.find(s => s.player === match.player2);

                if (p1 && p2) {
                    p1.played++;
                    p2.played++;
                    p1.pointsFor += match.score1;
                    p1.pointsAgainst += match.score2;
                    p2.pointsFor += match.score2;
                    p2.pointsAgainst += match.score1;

                    if (match.score1 > match.score2) {
                        p1.won++;
                        p2.lost++;
                        p1.points += 3;
                    } else if (match.score2 > match.score1) {
                        p2.won++;
                        p1.lost++;
                        p2.points += 3;
                    } else {
                        p1.drawn++;
                        p2.drawn++;
                        p1.points += 1;
                        p2.points += 1;
                    }
                }
            }
        });

        standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
        });

        this.state.standings = standings;
    },

    showTournament() {
        document.getElementById('setupScreen').classList.remove('active');
        document.getElementById('tournamentScreen').classList.add('active');

        document.getElementById('tournamentTitle').textContent = this.state.tournamentName;
        document.getElementById('tournamentType').textContent = `${this.state.tournamentType.charAt(0).toUpperCase() + this.state.tournamentType.slice(1)} Tournament`;

        this.renderTournament();
    },

    renderTournament() {
        const content = document.getElementById('tournamentContent');

        switch (this.state.tournamentType) {
            case 'knockout':
                this.renderKnockoutBracket();
                break;
            case 'league':
                this.renderLeagueTournament();
                break;
            case 'round-robin':
                this.renderRoundRobinTournament();
                break;
        }
    },

    renderKnockoutBracket() {
        const rounds = {};
        this.state.matches.forEach(match => {
            if (!rounds[match.round]) rounds[match.round] = [];
            rounds[match.round].push(match);
        });

        const content = document.getElementById('tournamentContent');
        let html = '<div class="bracket-view"><div class="bracket">';

        Object.keys(rounds).sort((a, b) => a - b).forEach(round => {
            const numRounds = Object.keys(rounds).length;
            let roundTitle;

            if (numRounds === 1) {
                roundTitle = 'Final';
            } else if (round == numRounds - 1) {
                roundTitle = 'Final';
            } else if (round == numRounds - 2) {
                roundTitle = 'Semi-Finals';
            } else if (round == numRounds - 3) {
                roundTitle = 'Quarter-Finals';
            } else {
                roundTitle = `Round ${round}`;
            }

            html += `
                <div class="bracket-round">
                    <div class="bracket-round-title">${roundTitle}</div>
            `;

            rounds[round].forEach(match => {
                const isCompleted = match.completed && match.winner;
                html += `
                    <div class="match-card ${isCompleted ? 'completed' : match.score1 !== null ? 'pending' : ''}">
                        <div class="player-score ${match.winner === match.player1 ? 'winner' : ''}">
                            <span>${match.player1}</span>
                            <span>${match.score1 !== null ? match.score1 : '-'}</span>
                        </div>
                        <div class="player-score ${match.winner === match.player2 ? 'winner' : ''}">
                            <span>${match.player2}</span>
                            <span>${match.score2 !== null ? match.score2 : '-'}</span>
                        </div>
                `;

                if (!isCompleted && match.player2 !== 'BYE') {
                    html += `<button type="button" class="btn-primary btn-small" style="width: 100%; margin-top: 10px;" onclick="TournamentApp.openScoreModal('${match.id}')">Enter Score</button>`;
                }

                html += '</div>';
            });

            html += '</div>';
        });

        html += '</div></div>';
        content.innerHTML = html;
    },

    renderLeagueTournament() {
        this.updateLeagueStandings();

        const content = document.getElementById('tournamentContent');
        const statsSection = document.getElementById('statsSection');

        // Calculate completion stats
        const completed = this.state.matches.filter(m => m.completed).length;
        const total = this.state.matches.length;
        const percentage = Math.round((completed / total) * 100);

        statsSection.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">Matches Complete</div>
                <div class="stat-value">${completed}/${total}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Progress</div>
                <div class="stat-value">${percentage}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Scoring</div>
                <div class="stat-value">3-1-0</div>
            </div>
        `;
        statsSection.style.display = 'grid';

        // League table
        let html = '<h3 style="margin-bottom: 15px;">League Table</h3>';
        html += '<table class="league-table"><thead><tr>';
        html += '<th>Position</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>PF</th><th>PA</th><th>Pts</th>';
        html += '</tr></thead><tbody>';

        this.state.standings.forEach((standing, idx) => {
            html += `
                <tr>
                    <td><span class="league-position">#${idx + 1}</span></td>
                    <td><strong>${standing.player}</strong></td>
                    <td>${standing.played}</td>
                    <td>${standing.won}</td>
                    <td>${standing.drawn}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.pointsFor}</td>
                    <td>${standing.pointsAgainst}</td>
                    <td><strong>${standing.points}</strong></td>
                </tr>
            `;
        });

        html += '</tbody></table>';

        // Matches
        html += '<h3 style="margin: 30px 0 15px;">Matches</h3>';
        html += '<div class="matches-section">';

        const allMatches = [...this.state.matches].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            return a.id.localeCompare(b.id);
        });

        allMatches.forEach(match => {
            html += `
                <div class="match-item">
                    <div class="match-teams">
                        <div class="team-row ${match.completed ? 'completed' : ''}">
                            <span class="team-name">${match.player1}</span>
                            <div class="team-score">
                                <span>${match.score1 !== null ? match.score1 : '-'}</span>
                            </div>
                        </div>
                        <div class="team-row ${match.completed ? 'completed' : ''}">
                            <span class="team-name">${match.player2}</span>
                            <div class="team-score">
                                <span>${match.score2 !== null ? match.score2 : '-'}</span>
                            </div>
                        </div>
                    </div>
                    <span class="match-status ${match.completed ? 'completed' : 'pending'}">
                        ${match.completed ? 'Complete' : 'Pending'}
                    </span>
            `;

            if (!match.completed) {
                html += `<button type="button" class="btn-primary btn-small" onclick="TournamentApp.openScoreModal('${match.id}')">Edit</button>`;
            }

            html += '</div>';
        });

        html += '</div>';
        content.innerHTML = html;
    },

    renderRoundRobinTournament() {
        this.updateLeagueStandings();

        const content = document.getElementById('tournamentContent');
        const statsSection = document.getElementById('statsSection');

        // Calculate completion stats
        const completed = this.state.matches.filter(m => m.completed).length;
        const total = this.state.matches.length;
        const percentage = Math.round((completed / total) * 100);

        let knockoutStatus = '';
        if (this.state.hasKnockoutFinals && this.state.knockoutMatches.length > 0) {
            const knockoutCompleted = this.state.knockoutMatches.filter(m => m.completed).length;
            knockoutStatus = ` | Finals: ${knockoutCompleted}/${this.state.knockoutMatches.length}`;
        }

        statsSection.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">League Matches</div>
                <div class="stat-value">${completed}/${total}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Progress</div>
                <div class="stat-value">${percentage}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Rounds</div>
                <div class="stat-value">${this.state.roundCount}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Scoring</div>
                <div class="stat-value">🏈 3-1-0</div>
            </div>
        `;
        statsSection.style.display = 'grid';

        // League table
        let html = '<h3 style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">';
        html += '<span>Final Standings</span>';
        if (this.state.hasKnockoutFinals && completed === total) {
            const finalLabel = this.state.teamsAdvancing === 2 ? 'play in Final' : `advance to Knockouts`;
            html += `<span style="font-size: 13px; color: var(--gray-500); font-weight: normal;">Top ${this.state.teamsAdvancing} ${finalLabel}</span>`;
        }
        html += '</h3>';

        html += '<table class="league-table"><thead><tr>';
        html += '<th>Position</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>';
        html += '</tr></thead><tbody>';

        this.state.standings.forEach((standing, idx) => {
            const isAdvancing = idx < this.state.teamsAdvancing && this.state.hasKnockoutFinals && completed === total;
            const goalDifference = standing.pointsFor - standing.pointsAgainst;
            html += `
                <tr${isAdvancing ? ' style="background: #fef3c7; font-weight: bold;"' : ''}>
                    <td><span class="league-position">#${idx + 1}${isAdvancing ? ' ✓' : ''}</span></td>
                    <td><strong>${standing.player}</strong></td>
                    <td>${standing.played}</td>
                    <td>${standing.won}</td>
                    <td>${standing.drawn}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.pointsFor}</td>
                    <td>${standing.pointsAgainst}</td>
                    <td>${goalDifference}</td>
                    <td><strong>${standing.points}</strong></td>
                </tr>
            `;
        });

        html += '</tbody></table>';

        // Matches by round
        for (let round = 1; round <= this.state.roundCount; round++) {
            const roundMatches = this.state.matches.filter(m => m.round === round);
            const completed = roundMatches.filter(m => m.completed).length;

            html += `<h3 style="margin: 30px 0 15px;">Round ${round} <span style="font-size: 13px; color: var(--gray-500);">(${completed}/${roundMatches.length} complete)</span></h3>`;
            html += '<div class="matches-section">';

            const sorted = [...roundMatches].sort((a, b) => {
                if (a.completed !== b.completed) return a.completed - b.completed;
                return a.id.localeCompare(b.id);
            });

            sorted.forEach(match => {
                html += `
                    <div class="match-item">
                        <div class="match-teams">
                            <div class="team-row ${match.completed ? 'completed' : ''}">
                                <span class="team-name">${match.player1}</span>
                                <div class="team-score">
                                    <span>${match.score1 !== null ? match.score1 : '-'}</span>
                                </div>
                            </div>
                            <div class="team-row ${match.completed ? 'completed' : ''}">
                                <span class="team-name">${match.player2}</span>
                                <div class="team-score">
                                    <span>${match.score2 !== null ? match.score2 : '-'}</span>
                                </div>
                            </div>
                        </div>
                        <span class="match-status ${match.completed ? 'completed' : 'pending'}">
                            ${match.completed ? 'Complete' : 'Pending'}
                        </span>
                `;

                if (!match.completed) {
                    html += `<button type="button" class="btn-primary btn-small" onclick="TournamentApp.openScoreModal('${match.id}')">Edit</button>`;
                }

                html += '</div>';
            });

            html += '</div>';
        }

        // Knockout Finals if applicable
        if (this.state.hasKnockoutFinals && completed === total) {
            if (this.state.knockoutMatches.length === 0) {
                // Generate knockout matches
                this.generateKnockoutFinals();
            }

            html += '<h2 style="margin: 40px 0 20px; padding-top: 20px; border-top: 2px solid var(--gray-200);">🏆 Knockout Finals</h2>';

            const rounds = {};
            this.state.knockoutMatches.forEach(match => {
                if (!rounds[match.round]) rounds[match.round] = [];
                rounds[match.round].push(match);
            });

            html += '<div class="bracket-view"><div class="bracket">';

            Object.keys(rounds).sort((a, b) => a - b).forEach(round => {
                const numRounds = Object.keys(rounds).length;
                let roundTitle;

                if (numRounds === 1) {
                    roundTitle = this.state.teamsAdvancing === 2 ? '🏆 Final' : 'Final';
                } else if (round == numRounds - 1) {
                    roundTitle = this.state.teamsAdvancing === 2 ? '🏆 Final' : 'Final';
                } else if (round == numRounds - 2) {
                    roundTitle = 'Semi-Finals';
                } else if (round == numRounds - 3) {
                    roundTitle = 'Quarter-Finals';
                } else {
                    roundTitle = `Round ${round}`;
                }

                html += `
                    <div class="bracket-round">
                        <div class="bracket-round-title">${roundTitle}</div>
                `;

                rounds[round].forEach(match => {
                    const isCompleted = match.completed && match.winner;
                    html += `
                        <div class="match-card ${isCompleted ? 'completed' : match.score1 !== null ? 'pending' : ''}">
                            <div class="player-score ${match.winner === match.player1 ? 'winner' : ''}">
                                <span>${match.player1}</span>
                                <span>${match.score1 !== null ? match.score1 : '-'}</span>
                            </div>
                            <div class="player-score ${match.winner === match.player2 ? 'winner' : ''}">
                                <span>${match.player2}</span>
                                <span>${match.score2 !== null ? match.score2 : '-'}</span>
                            </div>
                    `;

                    if (!isCompleted && match.player2 !== 'BYE') {
                        html += `<button type="button" class="btn-primary btn-small" style="width: 100%; margin-top: 10px;" onclick="TournamentApp.openScoreModal('knockout-${match.id}')">Enter Score</button>`;
                    }

                    html += '</div>';
                });

                html += '</div>';
            });

            html += '</div></div>';
        }

        content.innerHTML = html;
    },

    generateKnockoutFinals() {
        const top = this.state.standings.slice(0, this.state.teamsAdvancing).map(s => s.player);
        const knockoutMatches = [];
        let round = 1;

        let players = [...top];

        while (players.length > 1) {
            const roundMatches = [];
            for (let i = 0; i < players.length; i += 2) {
                if (i + 1 < players.length) {
                    roundMatches.push({
                        id: `${round}-${roundMatches.length}`,
                        round,
                        player1: players[i],
                        player2: players[i + 1],
                        score1: null,
                        score2: null,
                        winner: null,
                        completed: false,
                    });
                } else {
                    roundMatches.push({
                        id: `${round}-${roundMatches.length}`,
                        round,
                        player1: players[i],
                        player2: 'BYE',
                        score1: null,
                        score2: null,
                        winner: players[i],
                        completed: true,
                    });
                }
            }

            knockoutMatches.push(...roundMatches);
            players.splice(0, Math.min(2, players.length));
            round++;
        }

        this.state.knockoutMatches = knockoutMatches;
    },

    openScoreModal(matchId) {
        const match = this.state.matches.find(m => m.id === matchId);
        if (!match) return;

        document.getElementById('matchInfo').textContent = `${match.player1} vs ${match.player2}`;

        let form = '<div class="match-modal-content">';
        form += `
            <div class="match-modal-team">
                <h3>${match.player1}</h3>
                <label>Score</label>
                <input type="number" id="score1" min="0" value="${match.score1 !== null ? match.score1 : ''}" required>
            </div>
            <div class="match-modal-team">
                <h3>${match.player2}</h3>
                <label>Score</label>
                <input type="number" id="score2" min="0" value="${match.score2 !== null ? match.score2 : ''}" required>
            </div>
        `;
        form += '</div>';

        document.getElementById('matchForm').innerHTML = form;
        document.getElementById('scoreModal').classList.add('active');
        this.currentMatchId = matchId;

        document.getElementById('score1').focus();
    },

    submitScore() {
        const score1Val = document.getElementById('score1').value;
        const score2Val = document.getElementById('score2').value;

        if (!score1Val || !score2Val) {
            alert('Please enter valid scores');
            return;
        }

        const score1 = parseInt(score1Val);
        const score2 = parseInt(score2Val);

        if (isNaN(score1) || isNaN(score2)) {
            alert('Please enter valid scores');
            return;
        }

        const isKnockout = this.currentMatchId.startsWith('knockout-');
        const matchId = isKnockout ? this.currentMatchId.substring(9) : this.currentMatchId;
        const matchArray = isKnockout ? this.state.knockoutMatches : this.state.matches;

        const match = matchArray.find(m => m.id === matchId);
        if (!match) return;

        match.score1 = score1;
        match.score2 = score2;
        match.completed = true;

        if (this.state.tournamentType === 'knockout' || isKnockout) {
            if (score1 > score2) {
                match.winner = match.player1;
            } else if (score2 > score1) {
                match.winner = match.player2;
            }

            // Advance winner to next round
            const nextRound = matchArray.filter(m => m.round === match.round + 1);
            if (nextRound.length > 0) {
                const matchPosition = Math.floor(parseInt(match.id.split('-')[1]) / 2);
                const nextMatch = nextRound[matchPosition];
                if (nextMatch) {
                    if (parseInt(match.id.split('-')[1]) % 2 === 0) {
                        nextMatch.player1 = match.winner;
                    } else {
                        nextMatch.player2 = match.winner;
                    }
                }
            }
        }

        this.closeModal();
        this.saveToStorage();
        this.renderTournament();
    },

    closeModal() {
        document.getElementById('scoreModal').classList.remove('active');
        this.currentMatchId = null;
    },

    resetTournament() {
        if (confirm('Start a new tournament? Current progress will be lost.')) {
            this.state = {
                tournamentType: null,
                tournamentName: '',
                players: [],
                matches: [],
                standings: [],
                roundCount: 1,
                hasKnockoutFinals: false,
                teamsAdvancing: 4,
                currentRound: 1,
                knockoutMatches: [],
            };
            localStorage.removeItem('tournament');
            document.getElementById('tournamentScreen').classList.remove('active');
            document.getElementById('setupScreen').classList.add('active');
            document.getElementById('tournamentForm').reset();
            document.getElementById('tournamentName').value = '';
            document.getElementById('playerName').value = '';
            document.getElementById('playerList').value = '';
            document.querySelectorAll('.tournament-option').forEach(e => e.classList.remove('selected'));
            document.getElementById('roundRobinOptions').style.display = 'none';
            this.renderPlayerList();
        }
    },

    deleteTournament() {
        if (confirm('Delete this tournament permanently?')) {
            this.resetTournament();
        }
    },

    exportTournament() {
        const data = {
            name: this.state.tournamentName,
            type: this.state.tournamentType,
            players: this.state.players,
            matches: this.state.matches,
            standings: this.state.standings,
            exportedAt: new Date().toISOString(),
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.state.tournamentName.replace(/\s+/g, '-')}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    loadSavedTournament() {
        const saved = localStorage.getItem('tournament');
        if (saved) {
            this.state = JSON.parse(saved);
            this.showTournament();
        } else {
            alert('No saved tournament found');
        }
    },

    saveToStorage() {
        localStorage.setItem('tournament', JSON.stringify(this.state));
    },

    loadFromStorage() {
        const saved = localStorage.getItem('tournament');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    },

    showError(message) {
        const errorEl = document.getElementById('formError');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    },
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TournamentApp.init();
});
