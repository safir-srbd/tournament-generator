# 🌍 World Cup Group Stage Guide

## What is Group Stage?

The **Group Stage** feature divides teams into groups (like the FIFA World Cup), where each group plays a mini round-robin tournament. Teams are ranked within their group, and the top teams from each group advance to knockout finals.

## When to Use Group Stage

✅ **Use Group Stage when:**
- You have 8–64 teams (too many for a flat league)
- You want each team to play every other team in their group
- You want a realistic tournament structure (like UEFA, World Cup)
- You want top teams from each group to compete in a final knockout phase

❌ **Don't use Group Stage when:**
- You have fewer than 8 teams (use a regular league or knockout)
- You want all teams to play each other (use flat round-robin)
- You only want a single league table with no groups

## How Group Stage Works

### Step 1: Setup
1. Choose **⚽ Round Robin** tournament
2. Set **Number of Rounds** (1, 2, or 3 — each round happens within groups)
3. Check **"Use Group Stage"**
4. Enter the **Number of groups**, or enter **0** for automatic grouping
5. Check **"Add Knockout Finals"** (optional)
6. Select **"Teams Advancing"**

### Step 2: Teams Divided Into Groups
With the number of groups set to **0**, teams are automatically divided into
balanced groups of about four:
- **8 teams** → 2 groups of 4
- **12 teams** → 3 groups of 4
- **10 teams** → 3 groups (one 4, two 3)
- **16 teams** → 4 groups of 4
- **20 teams** → 4 groups of 5

### Step 3: Group League Play
Each group plays their own mini-league. For example, Group A plays 6 matches (each team vs 3 others).

Matches are organized by:
- **Group** (A, B, C…)
- **Round** (1, 2, 3 if multi-round)

Standings are calculated **per group** — not combined across groups.

### Step 4: Knockout Finals (Optional)
Once all group matches are complete:
- Top team from each group (and 2nd from each group if Top 8, etc.) advance
- They're auto-seeded into a knockout bracket
- Example: **Top 2 from each group of 4 groups** = 8 teams in quarter-finals

## Example: 12-Team Tournament

### Groups
```
Group A        Group B        Group C
• Team 1       • Team 5       • Team 9
• Team 2       • Team 6       • Team 10
• Team 3       • Team 7       • Team 11
• Team 4       • Team 8       • Team 12
```

### Group Matches (Round 1)
Each group plays 6 matches (all vs all):
- **Group A**: 1v2, 1v3, 1v4, 2v3, 2v4, 3v4
- **Group B**: 5v6, 5v7, 5v8, 6v7, 6v8, 7v8
- **Group C**: 9v10, 9v11, 9v12, 10v11, 10v12, 11v12

Total: 18 group matches

### Standings After Group Phase
```
GROUP A STANDINGS
#1 | Team A | 3W 0D 0L | 9 pts | Advances
#2 | Team B | 2W 0D 1L | 6 pts | Advances
#3 | Team C | 1W 0D 2L | 3 pts |
#4 | Team D | 0W 0D 3L | 0 pts |

GROUP B STANDINGS
#1 | Team E | 3W 0D 0L | 9 pts | Advances
#2 | Team F | 2W 0D 1L | 6 pts | Advances
#3 | Team G | 1W 0D 2L | 3 pts |
#4 | Team H | 0W 0D 3L | 0 pts |

GROUP C STANDINGS
#1 | Team I | 3W 0D 0L | 9 pts | Advances
#2 | Team J | 2W 0D 1L | 6 pts | Advances
#3 | Team K | 1W 0D 2L | 3 pts |
#4 | Team L | 0W 0D 3L | 0 pts |
```

### Knockout Finals
Top 2 from each group advance (6 teams):
- **Quarterfinals**: A vs J, E vs B, I vs F (3 matches)
- **Semifinals**: Winners advance (2 matches)
- **Final**: Champion (1 match)

Total knockout: 6 matches

**Tournament total**: 18 group matches + 6 knockout matches = **24 matches**

## Multi-Round Groups

If you choose **2 Rounds**:
- Each group plays their mini-league **twice** (home & away)
- Total per group: 12 matches (instead of 6)
- Standings still combined across both rounds

Example: Group A with 4 teams, 2 rounds:
```
Round 1: 1v2, 1v3, 1v4, 2v3, 2v4, 3v4 (6 matches)
Round 2: 1v2, 1v3, 1v4, 2v3, 2v4, 3v4 (6 matches again)
Total: 12 matches
```

All 12 matches count toward the same group standings.

## Tiebreaker Rules (Same as League)

When teams in a group have the same points:
1. **Points** (most first)
2. **Goal Difference** (best first)
3. **Goals For** (most first)
4. **Alphabetical** (A before B)

## Common Tournament Sizes

| Teams | Groups | Size | Matches/Group | Total Group | Total with Finals |
|-------|--------|------|---------------|-------------|-------------------|
| 8 | 2 | 4–4 | 6 | 12 | 16 (with Top 2 → 1 final) |
| 12 | 3 | 4–4–4 | 6 | 18 | 24 (with Top 2 → 6 finals) |
| 16 | 4 | 4–4–4–4 | 6 | 24 | 32 (with Top 2 → 8 finals) |
| 20 | 4 | 5–5–5–5 | 10 | 40 | 48 (with Top 2 → 8 finals) |
| 24 | 4 | 6–6–6–6 | 15 | 60 | 68 (with Top 2 → 8 finals) |

**Multiply by rounds**: 2 rounds = 2× matches; 3 rounds = 3× matches

## Tips

✓ **World Cup feel**: Use 16 or 32 teams in 4–8 groups with Top 2 advancing  
✓ **Quick tournament**: Use 8 teams in 2 groups with Top 2 finals = 15 total matches  
✓ **Full simulation**: Use 24 teams in 4 groups with 2 rounds and Top 2 finals = 68 total matches  
✓ **Home/away**: Use 2 rounds so each group plays home and away matches  

## FAQ

**Q: Can I add/remove teams after group stage starts?**  
A: No. Groups are fixed once the tournament starts.

**Q: What if a group has fewer teams?**  
A: Groups are auto-balanced. If needed, one group has 5 and others have 4.

**Q: Can I choose the number of groups?**  
A: Yes. Enter a positive whole number in **Number of groups**, or enter **0**
to use the automatic grouping logic.

**Q: Does round-robin with groups support multi-round?**  
A: Yes! Use 2 or 3 rounds and each group plays that many times.

**Q: What happens to 3rd place teams?**  
A: They don't advance. Only top N from each group make the knockouts.

**Q: Can I manually edit groups?**  
A: Not yet — auto-division is the only option right now.

---

**Ready for a group stage tournament? Start with 8–16 teams for the best experience! 🌍**
