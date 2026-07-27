# ⚽ Football Quick Guide

## Scoring (3-1-0 System)

```
Win  = 3 points
Draw = 1 point
Loss = 0 points
```

## Tournament Types

### 🎯 Knockout
- Traditional bracket
- Eliminate on loss
- Best for: Playoffs, finals

### 📊 League
- Everyone plays everyone once
- Ranked by points
- Best for: Full season

### ⚽ Round Robin
- Multi-round league
- Optional knockout finals
- Best for: Complete tournaments

## Quick Setup - Round Robin Tournament

### 1. Choose Round Robin
Click **⚽ Round Robin** button

### 2. Set Options
```
Rounds:    1 / 2 / 3
Finals:    ☑ (optional)
Teams Advance: Top 2 / 4 / 8 / 16
```

### 3. Add Teams
Type team names or paste list

### 4. Start Tournament

### 5. Enter Scores
Example: Arsenal 2-1 Chelsea
- Arsenal: 3 pts, +1 GD
- Chelsea: 0 pts, -1 GD

### 6. View Standings
Auto-ranked by:
1. Points (most first)
2. Goal Difference (+5 beats +2)
3. Goals For (8 beats 7)

### 7. Knockout Finals (if enabled)
Top 4/8/16 auto-seeded into bracket

## Standings Table

```
Pos | Team      | P | W | D | L | GF | GA | GD | Pts
----|-----------|---|---|---|---|----|----|----|----- 
#1  | Arsenal   | 3 | 2 | 1 | 0 | 7  | 2  | +5 | 7
#2  | Liverpool | 3 | 2 | 0 | 1 | 5  | 3  | +2 | 6
#3  | Chelsea   | 3 | 1 | 0 | 2 | 4  | 6  | -2 | 3
#4  | Man U     | 3 | 0 | 1 | 2 | 2  | 7  | -5 | 1
```

**Columns:**
- **P** = Played
- **W** = Won
- **D** = Drew
- **L** = Lost
- **GF** = Goals For (scored)
- **GA** = Goals Against (conceded)
- **GD** = Goal Difference
- **Pts** = Points

## Example Matches

### Win
```
Arsenal 3 - 1 Chelsea
→ Arsenal: 3 pts
→ Chelsea: 0 pts
```

### Draw
```
Man City 2 - 2 Liverpool
→ Man City: 1 pt
→ Liverpool: 1 pt
```

### Loss
```
Tottenham 0 - 2 Man United
→ Tottenham: 0 pts
→ Man United: 3 pts
```

## Multi-Round Examples

### 1 Round (4 teams)
```
Total matches: 6
Each team plays: 3 times
```

### 2 Rounds (4 teams)
```
Total matches: 12
Each team plays: 6 times (home + away)
```

### 3 Rounds (4 teams)
```
Total matches: 18
Each team plays: 9 times (3x each opponent)
```

## Knockout Finals

**After league matches complete:**

### Top 2 → Final Only
```
1st seed vs 2nd seed → Champion
Direct championship, no bracket
Perfect for: Quick decision, clear winner
```

### Top 4 → Semifinals
```
1st seed vs 4th seed → Winner A
2nd seed vs 3rd seed → Winner B
Winner A vs Winner B → Champion
```

### Top 8 → Quarterfinals
```
1v8, 2v7, 3v6, 4v5 → 4 winners
Winners play semifinals
```

### Top 16 → Quarterfinals
```
1v16, 2v15, 3v14... (8 matches)
8 winners → 4 semifinal matches
2 final matches
```

## Tips

✓ **Draws are realistic** - Include them for authentic tournaments
✓ **Goal Difference matters** - 3-0 better than 3-1 (both wins)
✓ **Use 2 rounds** - Creates home/away scenarios
✓ **Small = Fast** - 4-8 teams is quick
✓ **Large = Realistic** - 16+ teams like real leagues
✓ **Export regularly** - Backup your tournament as JSON
✓ **View standings** - Check progress anytime

## Formulas

**Points:** `(Wins × 3) + (Draws × 1) + (Losses × 0)`

**Goal Difference:** `Goals For - Goals Against`

**Ranking:** `Sort by Points DESC, then GD DESC, then GF DESC`

**Total Matches (Round Robin):** `(Teams × (Teams - 1)) ÷ 2 × Rounds`

## Common Tournament Sizes & Finals Options

| Teams | 1 Round | Finals | Best For |
|-------|---------|--------|----------|
| 2 | 1 | N/A | Head-to-head only |
| 4 | 6 | Top 2, 4 | Quick tournament |
| 6 | 15 | Top 2, 4 | Small league |
| 8 | 28 | Top 2, 4, 8 | Club tournament |
| 12 | 66 | Top 2, 4, 8 | Large league |
| 16 | 120 | Top 2, 4, 8, 16 | Full season |

**2-Round multiplies matches × 2 (home & away)**
**3-Round multiplies matches × 3**

## Keyboard Shortcuts

| Action | Method |
|--------|--------|
| Enter Score | Click "Edit" button |
| View Standings | Scroll to table |
| Edit Match | Click match, click "Edit" |
| Export | Click "📥 Export" button |
| New Tournament | Click "🔄 New Tournament" |

## Troubleshooting

**Q: Standings not updating?**
A: All scores saved auto. Refresh page.

**Q: Draw not recording?**
A: Enter same score (e.g., 1-1). Both teams get 1 pt.

**Q: Knockout not appearing?**
A: Finish ALL league matches first.

**Q: Wrong team advancing?**
A: Based on standings. Check GD (goal difference).

**Q: Can't edit match?**
A: Click "Edit" button on match card.

---

**Ready to create your tournament? 🏆**

1. Open **index.html**
2. Select **⚽ Round Robin**
3. Add teams
4. Configure rounds & finals
5. Click **Start Tournament**
6. Have fun! ⚽
