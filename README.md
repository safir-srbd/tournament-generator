# Tournament Generator 🏆

A complete, production-ready web-based tournament management application built with vanilla HTML, CSS, and JavaScript. Host it entirely on GitHub Pages—no backend server required!

## Features

### Tournament Types
- **🎯 Knockout (Single Elimination)**: Traditional bracket-style tournament where losers are eliminated
- **📊 League (Points Table)**: All players ranked by points earned from matches with football scoring (3-1-0)
- **⚽ Round Robin**: Multi-round football tournament with optional knockout finals

### Football Scoring System
All tournament types use professional football/soccer scoring:
- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points
- **Tiebreaker**: Goal Difference (Goals For - Goals Against)

### Player Management
- Add up to 64 players/teams
- Manual entry or paste comma-separated/line-separated lists
- Randomize player seeding/order
- Remove individual players
- Duplicate detection

### Data Persistence
- Automatic saving to browser `localStorage`
- Resume tournaments after page refresh
- Export tournament data as JSON
- Load previously saved tournaments

### User Interface
- Clean, modern, responsive design
- Gradient background with smooth animations
- Mobile-friendly (works on all screen sizes)
- Modal dialogs for score entry
- Live standings table with football stats (W-D-L, GF, GA, GD, Points)
- Progress tracking for league tournaments
- Bracket visualization for knockout tournaments

### Advanced Round Robin Features
- **Multi-Round Leagues**: 1, 2, or 3 rounds (each team plays opponents 1-3 times)
- **Knockout Finals**: Automatically generate knockout bracket from top-ranked teams
- **Options**: Choose between Top 4, Top 8, or Top 16 advancing to finals
- **Complete Integration**: Finals generated after all league matches complete

## File Structure

```
tournament-generator/
├── index.html      # Main HTML structure
├── styles.css      # All styling (responsive design)
├── app.js          # Core application logic
├── README.md       # This file
└── .gitignore      # Git ignore file (optional)
```

## Deployment to GitHub Pages

### Step 1: Create GitHub Repository
1. Create a new repository on GitHub (e.g., `tournament-generator`)
2. Clone it to your local machine or push your existing files

### Step 2: Push Files
```bash
cd tournament-generator
git add .
git commit -m "Initial commit: Tournament Generator app"
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch and **root** folder
5. Click **Save**
6. GitHub will provide your live URL (usually `https://username.github.io/tournament-generator`)

### Step 4: Access Your App
Your app is now live at the provided GitHub Pages URL!

## How to Use

### Setup
1. **Select Tournament Type**: Choose Knockout, League, or Round Robin
2. **Name Your Tournament**: Optional custom name (defaults to tournament type)
3. **Add Players**: 
   - Manually add one by one, OR
   - Paste a comma-separated or line-separated list
4. **Randomize (Optional)**: Shuffle player order before starting
5. **Start Tournament**: Begin the tournament

### During Tournament
- **Knockout**: Enter match scores → Winners advance automatically
- **League/Round Robin**: 
  - View standings table
  - Click "Edit" on pending matches to enter scores
  - Table updates automatically

### Managing Tournaments
- **Load Previous**: Reload last saved tournament
- **Export**: Download tournament data as JSON (for backup/sharing)
- **New Tournament**: Start fresh tournament (current progress lost)
- **Delete**: Remove tournament permanently

## LocalStorage Details

The app automatically saves to `localStorage` under the key `tournament`. Data includes:
- Tournament type and name
- Player list
- All match results
- Standings (for league tournaments)

Max storage: ~5-10MB (plenty for thousands of tournaments)

## Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
Edit the CSS variables in `styles.css` (`:root` section):
```css
:root {
    --primary: #6366f1;        /* Change main color */
    --success: #10b981;        /* Change success color */
    --danger: #ef4444;         /* Change danger color */
    /* ... more colors ... */
}
```

### Max Players
In `app.js`, search for `64` and change this limit:
```javascript
if (this.state.players.length >= 64) {
    this.showError('Maximum 64 players allowed');
}
```

### Match Scoring
Edit scoring logic in `updateLeagueStandings()` method (app.js):
- Win: 3 points (editable)
- Draw: 1 point (editable)
- Loss: 0 points

## Troubleshooting

### Data Not Saving?
- Check if localStorage is enabled in your browser
- Open DevTools (F12) → Application → LocalStorage
- Verify `tournament` key exists

### Tournament Not Loading?
- Clear browser cache and reload
- Check browser console for errors (F12)
- Try exporting and re-importing data

### Bracket Display Issues?
- Use a modern browser (Chrome, Firefox, Safari)
- On mobile: Use horizontal scroll or rotate device to landscape

## Development Notes

### Project Structure
- **index.html**: Semantic HTML5 with no external dependencies
- **styles.css**: 100% vanilla CSS with CSS Grid/Flexbox
- **app.js**: Single global object `TournamentApp` managing state

### Key Methods
- `startTournament()`: Initializes tournament based on type
- `generateKnockout()`: Creates knockout bracket structure
- `generateLeague()`: Creates round-robin match list
- `updateLeagueStandings()`: Calculates table standings
- `saveToStorage()` / `loadFromStorage()`: Persistence layer

### No Dependencies
This app uses **zero external libraries** or frameworks:
- No jQuery
- No React/Vue/Angular
- No Bootstrap or UI libraries
- Pure vanilla JavaScript ES6+

## Future Enhancement Ideas
- Import/export CSV
- Player seeding by rank
- Tiebreaker rules
- Multiple tournament simultaneous management
- Dark mode toggle
- Print bracket view
- Undo/redo functionality

## License
Free to use, modify, and distribute.

## Support
For issues or suggestions, open an issue on GitHub or modify the code as needed.

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
