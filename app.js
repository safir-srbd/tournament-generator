// Tournament Generator App
const TournamentApp = {
    state: null,
    currentMatchId: null,

    defaultState() {
        return {
            tournamentType: null,
            tournamentName: '',
            players: [],
            matches: [],
            standings: [],
            roundCount: 1,
            leagueRoundCount: 1,
            hasKnockoutFinals: false,
            teamsAdvancing: 4,
            currentRound: 1,
            knockoutMatches: [],
            useGroupStage: false,
            groupCount: 0,
            groups: [],
        };
    },

    init() {
        this.state = this.defaultState();
        this.initTheme();
        this.loadFromStorage();
        this.attachEventListeners();
        this.renderPlayerList();
    },

    // ===== Theme =====

    initTheme() {
        let theme = localStorage.getItem('tournament-theme');
        if (!theme) {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        this.setTheme(theme);
    },

    // 15px stroked glyphs — crisper than emoji and they inherit currentColor
    themeIcon: {
        sun: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="8" cy="8" r="3.1"/><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13"/></svg>',
        moon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 9.7A5.9 5.9 0 0 1 6.3 2.5a5.9 5.9 0 1 0 7.2 7.2z"/></svg>',
    },

    setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('tournament-theme', theme);
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.innerHTML = theme === 'dark' ? this.themeIcon.sun : this.themeIcon.moon;
            btn.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
        }
    },

    toggleTheme() {
        const current = document.documentElement.dataset.theme;
        this.setTheme(current === 'dark' ? 'light' : 'dark');
    },

    // ===== Setup / events =====

    attachEventListeners() {
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        document.querySelectorAll('.tournament-option').forEach(el => {
            el.addEventListener('click', () => this.selectTournamentType(el));
        });

        document.querySelectorAll('.input-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e));
        });

        document.getElementById('addPlayerBtn').addEventListener('click', () => this.addPlayer());
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addPlayer();
            }
        });
        document.getElementById('importPlayersBtn').addEventListener('click', () => this.importPlayers());
        document.getElementById('clearPlayersBtn').addEventListener('click', () => this.clearPlayers());
        document.getElementById('randomizeBtn').addEventListener('click', () => this.randomizePlayers());
        document.getElementById('useGroupStage').addEventListener('change', (e) => {
            document.getElementById('groupCountField').style.display = e.target.checked ? 'block' : 'none';
        });

        document.getElementById('tournamentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startTournament();
        });

        document.getElementById('loadBtn').addEventListener('click', () => this.loadSavedTournament());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTournament());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteTournament());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTournament());

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importTournament(e.target.files[0]);
                e.target.value = '';
            }
        });

        // Modal controls
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('submitScoreBtn').addEventListener('click', () => this.submitScore());
        document.getElementById('scoreModal').addEventListener('click', (e) => {
            if (e.target.id === 'scoreModal') this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('scoreModal').classList.contains('active')) return;
            if (e.key === 'Enter') {
                e.preventDefault();
                this.submitScore();
            } else if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },

    esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /*
     * Build fixtures with the circle method used for league schedules. Each
     * matchday contains every team at most once, so flattening the matchdays
     * cannot leave one team playing a long run of back-to-back matches.
     */
    buildRoundRobinSchedule(players, legCount = 1) {
        const rotation = [...players];
        if (rotation.length % 2 !== 0) rotation.push(null); // one bye per matchday

        const matchdays = [];
        const matchdayCount = Math.max(0, rotation.length - 1);
        const matchesPerDay = rotation.length / 2;

        for (let matchday = 1; matchday <= matchdayCount; matchday++) {
            const pairings = [];

            for (let i = 0; i < matchesPerDay; i++) {
                const left = rotation[i];
                const right = rotation[rotation.length - 1 - i];
                if (left === null || right === null) continue;

                // Alternating the first pairing avoids always giving the fixed
                // team the same home/away position.
                const swap = i === 0 && matchday % 2 === 0;
                pairings.push(swap
                    ? { player1: right, player2: left }
                    : { player1: left, player2: right });
            }

            matchdays.push(pairings);

            // Keep the first team fixed and rotate all remaining teams.
            if (rotation.length > 2) {
                rotation.splice(1, 0, rotation.pop());
            }
        }

        const fixtures = [];
        for (let leg = 1; leg <= legCount; leg++) {
            matchdays.forEach((pairings, dayIndex) => {
                pairings.forEach(pairing => {
                    const reverse = leg % 2 === 0;
                    fixtures.push({
                        player1: reverse ? pairing.player2 : pairing.player1,
                        player2: reverse ? pairing.player1 : pairing.player2,
                        round: leg,
                        matchday: dayIndex + 1,
                        gameweek: ((leg - 1) * matchdayCount) + dayIndex + 1,
                        fixtureOrder: fixtures.length,
                    });
                });
            });
        }

        return fixtures;
    },

    sortFixtures(matches) {
        // Stable sort keeps the generated matchday order. Completed fixtures
        // still move below pending ones without re-grouping games by player ID.
        return [...matches].sort((a, b) => Number(a.completed) - Number(b.completed));
    },

    gameweeksHTML(matches) {
        const gameweeks = {};
        const legacyMatchdayCount = matches.reduce(
            (max, match) => Math.max(max, match.matchday || 1),
            1
        );
        matches.forEach(match => {
            // Derive continuous numbering for saved fixtures created before
            // the explicit `gameweek` field was introduced.
            const gameweek = match.gameweek || (
                (((match.round || 1) - 1) * legacyMatchdayCount) + (match.matchday || 1)
            );
            (gameweeks[gameweek] = gameweeks[gameweek] || []).push(match);
        });

        return Object.keys(gameweeks)
            .map(Number)
            .sort((a, b) => a - b)
            .map(gameweek => {
                const fixtures = gameweeks[gameweek];
                const completed = fixtures.filter(match => match.completed).length;
                const fixtureRows = this.sortFixtures(fixtures)
                    .map(match => this.matchItemHTML(match, ''))
                    .join('');

                return `
                    <div class="section-title-row gameweek-title-row">
                        <h4 class="section-title">Gameweek ${gameweek}</h4>
                        <span class="section-hint">${completed}/${fixtures.length} complete</span>
                    </div>
                    <div class="matches-section">${fixtureRows}</div>
                `;
            })
            .join('');
    },

    selectTournamentType(el) {
        document.querySelectorAll('.tournament-option').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        this.state.tournamentType = el.dataset.type;

        const rrOptions = document.getElementById('roundRobinOptions');
        const leagueOptions = document.getElementById('leagueOptions');
        rrOptions.style.display = el.dataset.type === 'round-robin' ? 'block' : 'none';
        leagueOptions.style.display = el.dataset.type === 'league' ? 'block' : 'none';
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
        input.focus();
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
        if (this.state.players.length === 0) return;
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
            container.innerHTML = '<p class="empty-players">No entrants yet.</p>';
            return;
        }

        container.innerHTML = this.state.players.map((player, idx) => `
            <div class="player-item">
                <span>
                    <span class="player-num">${idx + 1}</span>
                    <span class="player-name">${this.esc(player)}</span>
                </span>
                <button type="button" class="btn-icon" aria-label="Remove ${this.esc(player)}"
                    onclick="TournamentApp.removePlayer(${idx})">&times;</button>
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

        if (this.state.tournamentType === 'league') {
            this.state.leagueRoundCount = parseInt(document.querySelector('input[name="leagueRoundCount"]:checked').value, 10) || 1;
        }

        if (this.state.tournamentType === 'round-robin') {
            this.state.roundCount = parseInt(document.querySelector('input[name="roundCount"]:checked').value, 10) || 1;
            this.state.useGroupStage = document.getElementById('useGroupStage').checked;
            const groupCountValue = Number(document.getElementById('groupCount').value);
            if (this.state.useGroupStage) {
                const maxGroupCount = Math.floor(this.state.players.length / 2);
                if (!Number.isInteger(groupCountValue) || groupCountValue < 0) {
                    this.showError('Number of groups must be 0 or a positive whole number');
                    return;
                }
                if (groupCountValue > maxGroupCount) {
                    this.showError(`Use at most ${maxGroupCount} groups so every group has at least 2 entrants`);
                    return;
                }
            }
            this.state.groupCount = this.state.useGroupStage ? groupCountValue : 0;
            this.state.hasKnockoutFinals = document.getElementById('knockoutFinals').checked;
            this.state.teamsAdvancing = parseInt(document.getElementById('teamsAdvancing').value, 10);
        }

        this.state.knockoutMatches = [];

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

    // ===== Bracket generation =====

    // Standard bracket seeding order (e.g. size 8 -> [1,8,4,5,2,7,3,6]),
    // so seed 1 meets seed 2 only in the final and byes go to top seeds.
    seedOrder(size) {
        let order = [1];
        while (order.length < size) {
            const next = [];
            const len = order.length * 2;
            order.forEach(seed => {
                next.push(seed);
                next.push(len + 1 - seed);
            });
            order = next;
        }
        return order;
    },

    buildBracket(seededPlayers) {
        const size = Math.max(2, Math.pow(2, Math.ceil(Math.log2(seededPlayers.length))));
        const totalRounds = Math.round(Math.log2(size));
        const slots = this.seedOrder(size).map(seed => seededPlayers[seed - 1] || 'BYE');
        const matches = [];

        for (let i = 0; i < size; i += 2) {
            const p1 = slots[i];
            const p2 = slots[i + 1];
            const match = {
                id: `1-${i / 2}`,
                round: 1,
                player1: p1,
                player2: p2,
                score1: null,
                score2: null,
                winner: null,
                completed: false,
            };
            if (p2 === 'BYE' && p1 !== 'BYE') {
                match.winner = p1;
                match.completed = true;
            } else if (p1 === 'BYE' && p2 !== 'BYE') {
                match.winner = p2;
                match.completed = true;
            }
            matches.push(match);
        }

        let count = size / 2;
        for (let round = 2; round <= totalRounds; round++) {
            count /= 2;
            for (let i = 0; i < count; i++) {
                matches.push({
                    id: `${round}-${i}`,
                    round,
                    player1: 'TBD',
                    player2: 'TBD',
                    score1: null,
                    score2: null,
                    winner: null,
                    completed: false,
                });
            }
        }

        // Push bye winners straight into round 2
        matches.filter(m => m.round === 1 && m.completed).forEach(m => this.advanceWinner(matches, m));
        return matches;
    },

    advanceWinner(matches, match) {
        const pos = parseInt(match.id.split('-')[1], 10);
        const next = matches.find(m =>
            m.round === match.round + 1 && parseInt(m.id.split('-')[1], 10) === Math.floor(pos / 2)
        );
        if (!next) return;

        const slot = pos % 2 === 0 ? 'player1' : 'player2';
        if (next[slot] === match.winner) return;

        next[slot] = match.winner;
        // If the next match was already played with a different participant,
        // its result is no longer valid — clear it and everything after it.
        if (next.completed || next.score1 !== null) {
            next.score1 = null;
            next.score2 = null;
            next.winner = null;
            next.completed = false;
            this.clearDownstream(matches, next);
        }
    },

    clearDownstream(matches, match) {
        const pos = parseInt(match.id.split('-')[1], 10);
        const next = matches.find(m =>
            m.round === match.round + 1 && parseInt(m.id.split('-')[1], 10) === Math.floor(pos / 2)
        );
        if (!next) return;

        const slot = pos % 2 === 0 ? 'player1' : 'player2';
        if (next[slot] === 'TBD') return;

        next[slot] = 'TBD';
        next.score1 = null;
        next.score2 = null;
        next.winner = null;
        next.completed = false;
        this.clearDownstream(matches, next);
    },

    generateKnockout() {
        this.state.matches = this.buildBracket([...this.state.players]);
    },

    generateLeague() {
        this.state.matches = this.buildRoundRobinSchedule(
            this.state.players,
            this.state.leagueRoundCount
        ).map((fixture, index) => ({
            ...fixture,
            id: `L-${index + 1}`,
            score1: null,
            score2: null,
            completed: false,
        }));
        this.updateLeagueStandings();
    },

    divideIntoGroups(players, requestedGroupCount = 0, groupSize = 4) {
        const groups = [];
        const automaticGroupCount = Math.ceil(players.length / groupSize);
        const numGroups = requestedGroupCount > 0 ? requestedGroupCount : automaticGroupCount;
        const baseSize = Math.floor(players.length / numGroups);
        const extraTeams = players.length % numGroups;

        let idx = 0;
        for (let g = 0; g < numGroups; g++) {
            const size = baseSize + (g < extraTeams ? 1 : 0);
            groups.push(players.slice(idx, idx + size));
            idx += size;
        }
        return groups;
    },

    generateMultiRoundRobin() {
        const matches = [];
        const players = this.state.players;

        if (this.state.useGroupStage) {
            this.state.groups = this.divideIntoGroups(players, this.state.groupCount, 4);
            let matchId = 0;
            this.state.groups.forEach((group, groupIdx) => {
                const groupFixtures = this.buildRoundRobinSchedule(group, this.state.roundCount);
                groupFixtures.forEach(fixture => {
                    matches.push({
                        ...fixture,
                        id: `G${groupIdx + 1}-${++matchId}`,
                        group: groupIdx + 1,
                        fixtureOrder: matchId - 1,
                        score1: null,
                        score2: null,
                        completed: false,
                    });
                });
            });
        } else {
            this.buildRoundRobinSchedule(players, this.state.roundCount).forEach((fixture, index) => {
                matches.push({
                    ...fixture,
                    id: `R-${index + 1}`,
                    score1: null,
                    score2: null,
                    completed: false,
                });
            });
        }

        this.state.matches = matches;
        this.state.currentRound = 1;
        this.updateLeagueStandings();
    },

    generateKnockoutFinals() {
        let top = [];

        if (this.state.useGroupStage) {
            // Get top teams from each group
            const numGroups = this.state.groups.length;
            const teamsPerGroup = Math.ceil(this.state.teamsAdvancing / numGroups);

            for (let g = 0; g < numGroups; g++) {
                const groupStandings = this.state.standings.filter(s => {
                    const inGroup = this.state.groups[g].includes(s.player);
                    return inGroup;
                });

                top.push(...groupStandings.slice(0, teamsPerGroup).map(s => s.player));
                if (top.length >= this.state.teamsAdvancing) {
                    top = top.slice(0, this.state.teamsAdvancing);
                    break;
                }
            }
        } else {
            top = this.state.standings
                .slice(0, this.state.teamsAdvancing)
                .map(s => s.player);
        }

        this.state.knockoutMatches = this.buildBracket(top);
    },

    // ===== Standings =====

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
                if (!p1 || !p2) return;

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
        });

        // Points, then goal difference, then goals for, then name
        standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const gdA = a.pointsFor - a.pointsAgainst;
            const gdB = b.pointsFor - b.pointsAgainst;
            if (gdB !== gdA) return gdB - gdA;
            if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
            return a.player.localeCompare(b.player);
        });

        this.state.standings = standings;
    },

    // ===== Rendering =====

    showTournament() {
        document.getElementById('setupScreen').classList.remove('active');
        document.getElementById('tournamentScreen').classList.add('active');

        document.getElementById('tournamentTitle').textContent = this.state.tournamentName;

        const sep = ' · ';
        let typeLabel;
        switch (this.state.tournamentType) {
            case 'knockout':
                typeLabel = ['Knockout', 'single elimination'].join(sep);
                break;
            case 'league':
                typeLabel = ['League', 'points table'].join(sep);
                break;
            case 'round-robin': {
                const parts = ['Round robin'];
                if (this.state.useGroupStage) {
                    parts.push(`${this.state.groups.length} groups`);
                } else {
                    parts.push(`${this.state.roundCount} round${this.state.roundCount > 1 ? 's' : ''}`);
                }
                if (this.state.hasKnockoutFinals) {
                    parts.push(this.state.teamsAdvancing === 2 ? 'final' : 'knockout finals');
                }
                typeLabel = parts.join(sep);
                break;
            }
            default:
                typeLabel = '';
        }
        document.getElementById('tournamentType').textContent = typeLabel;

        this.renderTournament();
    },

    renderTournament() {
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

    getChampion() {
        const type = this.state.tournamentType;
        const finalOf = (matches) => matches.reduce((a, b) => (b.round > a.round ? b : a), matches[0]);

        if (type === 'knockout') {
            if (this.state.matches.length === 0) return null;
            const final = finalOf(this.state.matches);
            return final.completed && final.winner ? final.winner : null;
        }

        const leagueDone = this.state.matches.length > 0 && this.state.matches.every(m => m.completed);
        if (type === 'round-robin' && this.state.hasKnockoutFinals) {
            if (!leagueDone || this.state.knockoutMatches.length === 0) return null;
            const final = finalOf(this.state.knockoutMatches);
            return final.completed && final.winner ? final.winner : null;
        }

        return leagueDone && this.state.standings.length > 0 ? this.state.standings[0].player : null;
    },

    championBannerHTML() {
        const champion = this.getChampion();
        if (!champion) return '';
        return `
            <div class="champion">
                <div class="champion-label">Champion</div>
                <div class="champion-name">${this.esc(champion)}</div>
            </div>
        `;
    },

    statsHTML(cards) {
        return cards.map(c => `
            <div class="stat">
                <div class="stat-label">${c.label}</div>
                <div class="stat-value">${c.value}</div>
                ${c.progress !== undefined ? `
                    <div class="meter"><span style="width: ${c.progress}%"></span></div>
                ` : ''}
            </div>
        `).join('');
    },

    // Every card is exactly two fixed-height rows tall, with no inner button.
    // Uniform height is what lets the bracket connectors line up exactly.
    matchCardHTML(match, idPrefix) {
        const isPlaceholder = p => p === 'BYE' || p === 'TBD';
        const ready = !isPlaceholder(match.player1) && !isPlaceholder(match.player2);

        const cls = ['match-card'];
        if (match.completed && match.winner) cls.push('is-done');

        const row = (player, score) => {
            const rowCls = ['ps'];
            if (match.winner && match.winner === player) rowCls.push('is-win');
            if (isPlaceholder(player)) rowCls.push('is-ph');
            return `<span class="${rowCls.join(' ')}">
                <span class="ps-name">${this.esc(player)}</span>
                <span class="ps-score">${score !== null ? score : '·'}</span>
            </span>`;
        };

        const label = !ready ? 'Awaiting result'
            : match.completed ? `Edit result: ${match.player1} vs ${match.player2}`
            : `Enter result: ${match.player1} vs ${match.player2}`;

        // The whole card is the control — keyboard and focus come free.
        return `<button type="button" class="${cls.join(' ')}" title="${this.esc(label)}"
            ${ready ? `onclick="TournamentApp.openScoreModal('${idPrefix}${match.id}')"` : 'disabled'}>
            ${row(match.player1, match.score1)}
            ${row(match.player2, match.score2)}
        </button>`;
    },

    roundLabel(round, totalRounds) {
        switch (totalRounds - round) {
            case 0: return 'Final';
            case 1: return 'Semi-finals';
            case 2: return 'Quarter-finals';
            case 3: return 'Round of 16';
            default: return `Round ${round}`;
        }
    },

    /*
     * Renders the bracket as a recursive tree rather than independent columns.
     * Each node is [feeders | self] laid out as a vertically centred flex row,
     * so a match always lands on the midpoint of the two matches feeding it —
     * at any depth, without measuring anything. Match `r-i` is fed by
     * `(r-1)-2i` and `(r-1)-(2i+1)`, mirroring advanceWinner().
     */
    bracketHTML(matches, idPrefix) {
        if (matches.length === 0) return '';

        const totalRounds = matches.reduce((max, m) => Math.max(max, m.round), 1);
        const pos = m => parseInt(m.id.split('-')[1], 10);
        const at = (round, index) => matches.find(m => m.round === round && pos(m) === index);

        const node = (round, index) => {
            const match = at(round, index);
            if (!match) return '';
            const self = `<div class="node-self">${this.matchCardHTML(match, idPrefix)}</div>`;
            if (round === 1) {
                return `<div class="node leaf">${self}</div>`;
            }
            return `<div class="node">
                <div class="node-children">${node(round - 1, index * 2)}${node(round - 1, index * 2 + 1)}</div>
                ${self}
            </div>`;
        };

        let headers = '';
        for (let r = 1; r <= totalRounds; r++) {
            headers += `<span>${this.roundLabel(r, totalRounds)}</span>`;
        }

        return `<div class="bracket-view">
            <div class="bracket">
                <div class="bracket-rounds">${headers}</div>
                <div class="bracket-tree">${node(totalRounds, 0)}</div>
            </div>
        </div>`;
    },

    matchItemHTML(match, idPrefix) {
        const scoreOf = s => (s !== null ? s : '–');
        const winner1 = match.completed && match.score1 > match.score2;
        const winner2 = match.completed && match.score2 > match.score1;
        return `
            <div class="match-row ${match.completed ? 'is-done' : ''}">
                <div class="mr-teams">
                    <span class="mr-team ${winner1 ? 'is-win' : ''}">
                        <span class="mr-name">${this.esc(match.player1)}</span>
                        <span class="mr-score">${scoreOf(match.score1)}</span>
                    </span>
                    <span class="mr-team ${winner2 ? 'is-win' : ''}">
                        <span class="mr-name">${this.esc(match.player2)}</span>
                        <span class="mr-score">${scoreOf(match.score2)}</span>
                    </span>
                </div>
                <div class="mr-action">
                    ${match.completed
                        ? `<button type="button" class="btn-ghost btn-small"
                               onclick="TournamentApp.openScoreModal('${idPrefix}${match.id}')">Edit</button>`
                        : `<button type="button" class="btn-secondary btn-small"
                               onclick="TournamentApp.openScoreModal('${idPrefix}${match.id}')">Result</button>`}
                </div>
            </div>
        `;
    },

    standingsTableHTML(highlightAdvancing) {
        let html = '<div class="table-wrap"><table class="league-table"><thead><tr>';
        html += '<th>#</th><th class="col-team">Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>';
        html += '</tr></thead><tbody>';

        this.state.standings.forEach((standing, idx) => {
            const isAdvancing = highlightAdvancing && idx < this.state.teamsAdvancing;
            const gd = standing.pointsFor - standing.pointsAgainst;
            const gdLabel = gd > 0 ? `+${gd}` : gd;
            html += `
                <tr class="${isAdvancing ? 'advancing' : ''}">
                    <td><span class="league-position">${idx + 1}</span></td>
                    <td class="col-team">${this.esc(standing.player)}${isAdvancing ? '<span class="advance-check">adv</span>' : ''}</td>
                    <td>${standing.played}</td>
                    <td>${standing.won}</td>
                    <td>${standing.drawn}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.pointsFor}</td>
                    <td>${standing.pointsAgainst}</td>
                    <td>${gdLabel}</td>
                    <td><strong>${standing.points}</strong></td>
                </tr>
            `;
        });

        html += '</tbody></table></div>';
        return html;
    },

    renderKnockoutBracket() {
        const statsSection = document.getElementById('statsSection');
        const playable = this.state.matches.filter(m => m.player2 !== 'BYE' && m.player1 !== 'BYE');
        const completed = playable.filter(m => m.completed).length;
        const total = playable.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const totalRounds = this.state.matches.reduce((max, m) => Math.max(max, m.round), 1);

        statsSection.innerHTML = this.statsHTML([
            { label: 'Entrants', value: this.state.players.length },
            { label: 'Matches played', value: `${completed}/${total}`, progress: percentage },
            { label: 'Rounds', value: totalRounds },
        ]);
        statsSection.style.display = 'grid';

        const content = document.getElementById('tournamentContent');
        content.innerHTML = this.championBannerHTML() + this.bracketHTML(this.state.matches, '');
    },

    renderLeagueTournament() {
        this.updateLeagueStandings();

        const content = document.getElementById('tournamentContent');
        const statsSection = document.getElementById('statsSection');

        const completed = this.state.matches.filter(m => m.completed).length;
        const total = this.state.matches.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        statsSection.innerHTML = this.statsHTML([
            { label: 'Teams', value: this.state.players.length },
            { label: 'Matches played', value: `${completed}/${total}`, progress: percentage },
            { label: 'W / D / L', value: '3 · 1 · 0' },
        ]);
        statsSection.style.display = 'grid';

        let html = this.championBannerHTML();
        html += '<h3 class="section-title">Table</h3>';
        html += this.standingsTableHTML(false);

        // A round is a complete leg; gameweeks separate its fixture dates.
        const rounds = {};
        this.state.matches.forEach(m => {
            const round = m.round || 1;
            (rounds[round] = rounds[round] || []).push(m);
        });

        const roundNums = Object.keys(rounds).map(Number).sort((a, b) => a - b);

        if (roundNums.length > 0) {
            html += '<h3 class="section-title">Fixtures</h3>';
            roundNums.forEach(round => {
                const roundMatches = rounds[round];
                const roundDone = roundMatches.filter(m => m.completed).length;
                html += `
                    <div class="section-title-row">
                        <h3 class="section-title">Round ${round}</h3>
                        <span class="section-hint">${roundDone}/${roundMatches.length} complete</span>
                    </div>
                `;
                html += this.gameweeksHTML(roundMatches);
            });
        }

        content.innerHTML = html;
    },

    renderRoundRobinTournament() {
        this.updateLeagueStandings();

        const content = document.getElementById('tournamentContent');
        const statsSection = document.getElementById('statsSection');

        const completed = this.state.matches.filter(m => m.completed).length;
        const total = this.state.matches.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const leagueDone = total > 0 && completed === total;

        // Generate the finals bracket once the league phase is finished
        if (this.state.hasKnockoutFinals && leagueDone && this.state.knockoutMatches.length === 0) {
            this.generateKnockoutFinals();
            this.saveToStorage();
        }

        const stats = [
            { label: this.state.useGroupStage ? 'Group matches' : 'League matches', value: `${completed}/${total}`, progress: percentage },
            { label: this.state.useGroupStage ? 'Groups' : 'Rounds', value: this.state.useGroupStage ? this.state.groups.length : this.state.roundCount },
            { label: 'W / D / L', value: '3 · 1 · 0' },
        ];
        if (this.state.hasKnockoutFinals && this.state.knockoutMatches.length > 0) {
            const koPlayable = this.state.knockoutMatches.filter(m => m.player2 !== 'BYE');
            const koDone = koPlayable.filter(m => m.completed).length;
            stats.push({ label: 'Finals', value: `${koDone}/${koPlayable.length}` });
        }
        statsSection.innerHTML = this.statsHTML(stats);
        statsSection.style.display = 'grid';

        let html = this.championBannerHTML();

        if (this.state.useGroupStage) {
            // Show group standings
            for (let g = 0; g < this.state.groups.length; g++) {
                const groupName = String.fromCharCode(65 + g); // A, B, C, ...
                const groupStandings = this.state.standings.filter(s => this.state.groups[g].includes(s.player));

                html += `<h3 class="section-title">Group ${groupName}</h3>`;
                html += '<div class="table-wrap"><table class="league-table"><thead><tr>';
                html += '<th>#</th><th class="col-team">Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>';
                html += '</tr></thead><tbody>';

                groupStandings.forEach((standing, idx) => {
                    const gd = standing.pointsFor - standing.pointsAgainst;
                    const gdLabel = gd > 0 ? `+${gd}` : gd;
                    html += `
                        <tr>
                            <td><span class="league-position">${idx + 1}</span></td>
                            <td class="col-team">${this.esc(standing.player)}</td>
                            <td>${standing.played}</td>
                            <td>${standing.won}</td>
                            <td>${standing.drawn}</td>
                            <td>${standing.lost}</td>
                            <td>${standing.pointsFor}</td>
                            <td>${standing.pointsAgainst}</td>
                            <td>${gdLabel}</td>
                            <td><strong>${standing.points}</strong></td>
                        </tr>
                    `;
                });

                html += '</tbody></table></div>';
            }

            // Show matches by group
            for (let g = 0; g < this.state.groups.length; g++) {
                const groupName = String.fromCharCode(65 + g);
                for (let round = 1; round <= this.state.roundCount; round++) {
                    const groupMatches = this.state.matches.filter(m => m.group === g + 1 && m.round === round);
                    if (groupMatches.length === 0) continue;

                    const roundDone = groupMatches.filter(m => m.completed).length;
                    html += `
                        <div class="section-title-row">
                            <h3 class="section-title">Group ${groupName} · Round ${round}</h3>
                            <span class="section-hint">${roundDone}/${groupMatches.length} complete</span>
                        </div>
                    `;
                    html += this.gameweeksHTML(groupMatches);
                }
            }
        } else {
            // Regular standings (non-group stage)
            html += '<div class="section-title-row"><h3 class="section-title">Standings</h3>';
            if (this.state.hasKnockoutFinals) {
                const finalLabel = this.state.teamsAdvancing === 2 ? 'play the Final' : 'advance to Knockouts';
                html += `<span class="section-hint">Top ${this.state.teamsAdvancing} ${finalLabel}</span>`;
            }
            html += '</div>';
            html += this.standingsTableHTML(this.state.hasKnockoutFinals && leagueDone);

            for (let round = 1; round <= this.state.roundCount; round++) {
                const roundMatches = this.state.matches.filter(m => m.round === round);
                const roundDone = roundMatches.filter(m => m.completed).length;

                html += `
                    <div class="section-title-row">
                        <h3 class="section-title">Round ${round}</h3>
                        <span class="section-hint">${roundDone}/${roundMatches.length} complete</span>
                    </div>
                `;
                html += this.gameweeksHTML(roundMatches);
            }
        }

        if (this.state.hasKnockoutFinals && leagueDone && this.state.knockoutMatches.length > 0) {
            const koTitle = this.state.teamsAdvancing === 2 ? 'Championship final' : 'Knockout finals';
            html += `<h2 class="finals-heading">${koTitle}</h2>`;
            html += this.bracketHTML(this.state.knockoutMatches, 'knockout-');
        }

        content.innerHTML = html;
    },

    // ===== Score entry =====

    findMatch(fullId) {
        const isKnockoutFinal = fullId.startsWith('knockout-');
        const matchArray = isKnockoutFinal ? this.state.knockoutMatches : this.state.matches;
        const id = isKnockoutFinal ? fullId.slice(9) : fullId;
        return {
            match: matchArray.find(m => m.id === id),
            matchArray,
            isKnockoutFinal,
        };
    },

    openScoreModal(matchId) {
        const { match } = this.findMatch(matchId);
        if (!match) return;

        document.getElementById('matchInfo').textContent = `${match.player1} vs ${match.player2}`;

        const isElimination = matchId.startsWith('knockout-') || this.state.tournamentType === 'knockout';
        document.getElementById('matchForm').innerHTML = `
            <div class="match-modal-content">
                <div class="match-modal-team">
                    <h3>${this.esc(match.player1)}</h3>
                    <label for="score1">Score</label>
                    <input type="number" id="score1" min="0" max="999" inputmode="numeric" value="${match.score1 !== null ? match.score1 : ''}" required>
                </div>
                <div class="modal-vs">vs</div>
                <div class="match-modal-team">
                    <h3>${this.esc(match.player2)}</h3>
                    <label for="score2">Score</label>
                    <input type="number" id="score2" min="0" max="999" inputmode="numeric" value="${match.score2 !== null ? match.score2 : ''}" required>
                </div>
            </div>
            ${isElimination ? '<p class="modal-hint">Knockout match — a winner is required (no draws).</p>' : ''}
        `;

        const errorEl = document.getElementById('modalError');
        errorEl.style.display = 'none';

        document.getElementById('scoreModal').classList.add('active');
        this.currentMatchId = matchId;
        document.getElementById('score1').focus();
    },

    showModalError(message) {
        const errorEl = document.getElementById('modalError');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    },

    submitScore() {
        if (!this.currentMatchId) return;

        const score1Val = document.getElementById('score1').value;
        const score2Val = document.getElementById('score2').value;
        const score1 = parseInt(score1Val, 10);
        const score2 = parseInt(score2Val, 10);

        if (score1Val === '' || score2Val === '' || isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
            this.showModalError('Please enter a valid score for both teams');
            return;
        }

        const { match, matchArray, isKnockoutFinal } = this.findMatch(this.currentMatchId);
        if (!match) return;

        const isElimination = isKnockoutFinal || this.state.tournamentType === 'knockout';
        if (isElimination && score1 === score2) {
            this.showModalError('Knockout matches cannot end in a draw — one team must win');
            return;
        }

        match.score1 = score1;
        match.score2 = score2;
        match.completed = true;

        if (isElimination) {
            match.winner = score1 > score2 ? match.player1 : match.player2;
            this.advanceWinner(matchArray, match);
        }

        // If a league score is edited before the finals bracket has been played,
        // re-seed the bracket from the updated standings.
        if (!isKnockoutFinal && this.state.tournamentType === 'round-robin' && this.state.knockoutMatches.length > 0) {
            const finalsStarted = this.state.knockoutMatches.some(m => m.score1 !== null);
            if (!finalsStarted) {
                this.updateLeagueStandings();
                this.generateKnockoutFinals();
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

    // ===== Persistence =====

    resetState() {
        this.state = this.defaultState();
        localStorage.removeItem('tournament');
        document.getElementById('tournamentScreen').classList.remove('active');
        document.getElementById('setupScreen').classList.add('active');
        document.getElementById('tournamentForm').reset();
        document.getElementById('tournamentName').value = '';
        document.getElementById('playerName').value = '';
        document.getElementById('playerList').value = '';
        document.querySelectorAll('.tournament-option').forEach(e => e.classList.remove('selected'));
        document.getElementById('roundRobinOptions').style.display = 'none';
        document.getElementById('useGroupStage').checked = false;
        document.getElementById('groupCount').value = '0';
        document.getElementById('groupCountField').style.display = 'none';
        document.getElementById('knockoutFinals').checked = true;
        this.renderPlayerList();
    },

    resetTournament() {
        if (confirm('Start a new tournament? Current progress will be lost.')) {
            this.resetState();
        }
    },

    deleteTournament() {
        if (confirm('Delete this tournament permanently?')) {
            this.resetState();
        }
    },

    exportTournament() {
        const data = Object.assign({}, this.state, {
            version: 2,
            exportedAt: new Date().toISOString(),
        });

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(this.state.tournamentName || 'tournament').replace(/[^\w-]+/g, '-')}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importTournament(file) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                const type = data.tournamentType || data.type;
                if (!type || !Array.isArray(data.players) || !Array.isArray(data.matches)) {
                    throw new Error('Invalid file');
                }
                this.state = Object.assign(this.defaultState(), data, {
                    tournamentType: type,
                    tournamentName: data.tournamentName || data.name || 'Imported Tournament',
                });
                delete this.state.version;
                delete this.state.exportedAt;
                delete this.state.name;
                delete this.state.type;
                this.saveToStorage();
                this.showTournament();
            } catch (e) {
                this.showError('Could not import — not a valid tournament file');
            }
        };
        reader.readAsText(file);
    },

    loadSavedTournament() {
        const saved = localStorage.getItem('tournament');
        if (saved && JSON.parse(saved).tournamentType) {
            this.state = Object.assign(this.defaultState(), JSON.parse(saved));
            this.showTournament();
        } else {
            this.showError('No saved tournament found');
        }
    },

    saveToStorage() {
        localStorage.setItem('tournament', JSON.stringify(this.state));
    },

    loadFromStorage() {
        const saved = localStorage.getItem('tournament');
        if (saved) {
            try {
                this.state = Object.assign(this.defaultState(), JSON.parse(saved));
            } catch (e) {
                this.state = this.defaultState();
            }
        }
    },

    showError(message) {
        const errorEl = document.getElementById('formError');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        clearTimeout(this._errorTimer);
        this._errorTimer = setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    },
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TournamentApp.init();
});
