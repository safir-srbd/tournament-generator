# ⚽ Football Tournament Features

Complete documentation for the advanced football/soccer tournament features in Tournament Generator.

## Scoring System (3-1-0)

All tournament types use professional football scoring:

| Result | Points |
|--------|--------|
| **Win** | 3 points |
| **Draw** | 1 point |
| **Loss** | 0 points |

### Tiebreaker System
When teams have equal points, standings are determined by:
1. **Goal Difference (GD)** = Goals For - Goals Against
   - Higher goal difference ranks higher
2. **Goals For (GF)** = Total goals scored
   - More goals scored wins tiebreaker
3. **Head-to-Head** (if displaying both matches)

## Tournament Types with Football Logic

### 1️⃣ Knockout (Single Elimination)
- Standard knockout bracket
- Scores entered as goals (not sets or games)
- Winner determined by most goals scored
- Automatically advances to next round
- Perfect for: Playoffs, finals, quick tournaments

**Example:**
```
Match: Team A vs Team B
Scores: 3 - 1
Winner: Team A
Result: Team A advances, Team B is eliminated
```

### 2️⃣ League (Point Table)
- Round-robin format, single round
- Every team plays every other team once
- Standings calculated using 3-1-0 scoring
- Sorted by: Points → Goal Difference → Goals For
- Perfect for: Season standings, tournaments with many teams

**Example Standings Table:**
```
Position | Team    | P  | W | D | L | GF | GA | GD  | Pts
---------|---------|-------|---|---|---|----|----|-----|-----
#1       | Team A  | 3 | 2 | 1 | 0 | 7  | 2  | +5  | 7
#2       | Team B  | 3 | 2 | 0 | 1 | 5  | 3  | +2  | 6
#3       | Team C  | 3 | 1 | 0 | 2 | 4  | 6  | -2  | 3
#4       | Team D  | 3 | 0 | 1 | 2 | 2  | 7  | -5  | 1
```

### 3️⃣ Round Robin (Multi-Round Football)
Advanced tournament combining league and knockout:

#### League Phase
- **Rounds**: 1, 2, or 3 complete rounds
- **1 Round**: Each team plays every other team once
- **2 Rounds**: Each team plays every other team twice (home & away)
- **3 Rounds**: Each team plays every other team three times
- **Scoring**: Same 3-1-0 system

#### Knockout Finals (Optional)
Automatically generates knockout bracket:
- **Top 4 (Semifinals)**: 2 matches → Final
- **Top 8 (Quarterfinals)**: 4 → 2 → 1 match
- **Top 16**: 8 → 4 → 2 → 1 match
- Seeded by league standings (1st seed gets best opponent)

**Tournament Flow:**
```
1. Enter players
2. Select: 1/2/3 rounds
3. Select: Knockout finals (optional)
4. All league matches completed
5. Top teams automatically seed into knockout
6. Knockout bracket generated
7. Enter knockout scores
8. Crown champion!
```

## How to Use Round Robin

### Step 1: Setup
1. Select **⚽ Round Robin** tournament type
2. Add player names (teams)
3. Tournament options appear

### Step 2: Configure Options
```
Number of Rounds:
  ○ 1 Round (everyone plays once)
  ○ 2 Rounds (home & away)
  ○ 3 Rounds (three complete cycles)

☑ Add Knockout Finals (optional)
  - Top 4 (default)
  - Top 8
  - Top 16
```

### Step 3: Play League Matches
- Enter scores for all league matches
- Standings update automatically
- Supports draws!

**Example Match Entry:**
```
Team A vs Team B
Score: 2 - 2
Result: Both get 1 point (draw)

Team C vs Team D
Score: 3 - 1
Result: C gets 3 pts, D gets 0 pts
```

### Step 4: Knockout Finals (if enabled)
- After all league matches complete
- Top N teams automatically advance
- New bracket displays based on standings
- Enter knockout scores
- Winners advance to next round
- Crown champion!

## Standings Table Explained

| Column | Meaning |
|--------|---------|
| Position | Final rank (#1, #2, etc.) |
| Team | Team/Player name |
| P | Played (total matches) |
| W | Wins |
| D | Draws |
| L | Losses |
| GF | Goals For (total scored) |
| GA | Goals Against (total conceded) |
| GD | Goal Difference (GF - GA) |
| Pts | Points (3W + 1D) |

**Sorting Priority:**
1. **Pts** (Total points descending)
2. **GD** (Goal difference descending)
3. **GF** (Goals for descending)

## Example Tournament Scenarios

### Scenario 1: Small League (4 Teams, 1 Round)
```
Players: Arsenal, Chelsea, Liverpool, United

Matches:
- Arsenal 2 - 1 Chelsea (A: 3pts, C: 0pts)
- Arsenal 1 - 1 Liverpool (A: 1pt, L: 1pt)
- Arsenal 3 - 0 United (A: 3pts, U: 0pts)
- Chelsea 0 - 2 Liverpool (C: 0pts, L: 3pts)
- Chelsea 1 - 1 United (C: 1pt, U: 1pt)
- Liverpool 2 - 0 United (L: 3pts, U: 0pts)

Final Standings:
1. Arsenal: 7 pts (GD: +3)
2. Liverpool: 7 pts (GD: +1)
3. Chelsea: 1 pt (GD: -4)
4. United: 1 pt (GD: -4)

Winner: Arsenal (better GD)
```

### Scenario 2: Multi-Round with Knockouts (8 Teams, 2 Rounds + Top 4 Knockouts)
```
Players: 8 teams

League Phase:
- Round 1: Each team plays 7 matches
- Round 2: Each team plays 7 matches again
Total: 14 matches per team

Standings after League:
1. Team A: 15 pts
2. Team B: 12 pts
3. Team C: 9 pts
4. Team D: 8 pts
5. Team E: 6 pts
6. Team F: 5 pts
7. Team G: 3 pts
8. Team H: 2 pts

Knockout Finals (Top 4):
Semifinals:
- Team A vs Team D
- Team B vs Team C

Finals:
- Winner of A vs D
- Winner of B vs C
```

### Scenario 3: Large League (16 Teams, 1 Round)
```
Players: 16 teams
Total Matches: 120 (each team plays 15 matches)
Matches Per Team: 15
Total Points Available: 120 × 3 = 360

Perfect for: Full season simulation, league championships
```

## Advanced Features

### Draws
- Supported in all tournament types
- Both teams get 1 point
- Both teams get appropriate GF/GA credited
- Contributes to final standings

### Goal Difference Tiebreaker
- Automatically calculated from match scores
- Positive GD = scored more than conceded
- Negative GD = conceded more than scored
- Displayed in standings as: `+5`, `-3`, `0`

### Seeding
- Knockout finals automatically seeded 1-4, 1-8, or 1-16
- 1st seed faces lowest-ranked remaining team
- Follows standard tournament seeding rules

### Multi-Match Records
- 2-round leagues mean teams play twice
- Each match is counted separately
- Goals, wins, draws, losses all accumulated
- Creates realistic league scenarios (home/away)

## Tips & Tricks

### For Realistic Leagues
- Use 2 Rounds for home/away effect
- Set realistic goal-per-match averages (1.5-2.5)
- Include draws for authenticity
- Use 16-32 teams for large leagues

### For Exciting Tournaments
- Use 1 Round + Knockout Finals
- Set tight match scores (2-1, 3-2) for drama
- Top 4 works well for 8+ teams
- Top 8 better for 16+ teams

### For Quick Tournaments
- Use 1 Round, no finals
- 4-8 teams for speed
- Enter bulk scores to simulate

### Goal Difference Strategy
- Tracking GD is key for tiebreakers
- Big wins help (3-0 better than 3-2)
- Close losses hurt more (0-3 vs 0-1)
- Draws preserve GD but don't help much

## Scoring Comparison

| System | Win | Draw | Loss | Use Case |
|--------|-----|------|------|----------|
| **3-1-0 (Football)** | 3 | 1 | 0 | Soccer, sports leagues |
| **2-1-0 (Alt)** | 2 | 1 | 0 | Some sports |
| **1-0-0 (Tennis)** | 1 | - | 0 | Best-of series |
| **Points-only** | Vary | - | - | Point-scored sports |

## FAQ

**Q: Can I have draws in knockout finals?**
A: Currently wins/losses only. For draws, use league round and check standings.

**Q: What if teams have same GD and GF?**
A: They remain in order. Consider adding head-to-head matches.

**Q: Can I change scoring after starting?**
A: No. Export, start new tournament with different scoring.

**Q: How many total matches in 3-round league with 16 teams?**
A: `16 × 15 ÷ 2 × 3 = 360 matches`. Very long tournament!

**Q: Best number for knockout finals?**
A: Top 4 for 6-12 teams, Top 8 for 13-32 teams, Top 16 for 32+ teams.

**Q: Can I export to Excel/spreadsheet?**
A: Export JSON → convert to spreadsheet format manually.

**Q: Are matches randomized in knockouts?**
A: No, seeded by league standings (fixed bracket).

## Future Enhancements

Possible additions for football features:
- [ ] Extra time / penalty shootouts
- [ ] Away goals rule
- [ ] Group stages before knockouts
- [ ] CSV export to Excel
- [ ] Team colors/logos
- [ ] Red/yellow cards tracking
- [ ] Player statistics
- [ ] Head-to-head tiebreaker
- [ ] Custom scoring systems

---

**Enjoy managing your football tournaments! ⚽🏆**
