# Quick Start Guide - Tournament Generator

## 🚀 Get Started in 2 Minutes

### Local Testing
1. Open `index.html` in your web browser
2. That's it! The app works offline immediately

### Push to GitHub Pages
1. Create a GitHub repository called `tournament-generator`
2. Clone it locally or add the files to an existing repo
3. Run these commands:
   ```bash
   git add .
   git commit -m "Add Tournament Generator app"
   git push origin main
   ```
4. Go to **Settings** → **Pages** → Select **main** branch
5. Your app is now live at `https://yourusername.github.io/tournament-generator`

## 📋 Using the App

### Creating a Tournament

**Step 1:** Select tournament type
- 🎯 **Knockout**: Best for competitions (winners advance, losers out)
- 📊 **League**: Best for sports seasons (points-based ranking)
- 🔄 **Round Robin**: Best for small groups (everyone plays everyone)

**Step 2:** Add players
- Type names one-by-one, OR
- Paste a comma-separated list: `Alice, Bob, Charlie`
- Or paste line-separated: 
  ```
  Alice
  Bob
  Charlie
  ```

**Step 3:** Start tournament
- Optionally randomize order
- Click "Start Tournament"

### During the Tournament

**Knockout Mode:**
- Click "Enter Score" on each match
- Winner advances automatically
- Continue until champion is crowned

**League/Round Robin Mode:**
- See live standings table
- Click "Edit" to enter match scores
- Standings update in real-time

### Saving & Loading

- **Automatic**: Tournament saves to browser automatically
- **Export**: Download as JSON backup
- **Load Previous**: Reload last tournament
- **New Tournament**: Clear and start fresh

## 💾 Data Storage

Data is stored in your browser's `localStorage`:
- Survives page refreshes
- ~5-10MB storage (never fills up)
- Private to your device (not synced)
- Export to backup or transfer

## 🎨 Customizing

Want to change colors? Edit `styles.css`:
```css
:root {
    --primary: #6366f1;        /* Main color */
    --success: #10b981;        /* Success/winner color */
    --danger: #ef4444;         /* Danger/delete color */
}
```

## ❓ Common Questions

**Q: Can I use this for real tournaments?**
A: Yes! Perfect for office competitions, sports leagues, gaming tournaments, etc.

**Q: What if I lose my data?**
A: Export tournaments regularly as JSON. Use the "Export" button to download.

**Q: Can multiple people use it?**
A: Share the GitHub Pages URL. Each person has their own browser data. Or export/import to share progress.

**Q: How many players can I add?**
A: Up to 64 players. Change in `app.js` if you need more.

**Q: Does it work offline?**
A: Yes! Works perfectly offline. Just open the HTML file.

**Q: Can I print the bracket?**
A: Use browser Print (Ctrl+P or Cmd+P) to print tournament data.

## 🐛 Troubleshooting

**"No saved tournament found"**
- First tournament? This message appears when loading a new tournament

**Data disappeared after refresh**
- Check if cookies/storage are cleared on exit
- Export your tournament data regularly

**Scores not saving**
- Reload the page and try again
- Check browser console (F12) for errors

**Mobile layout broken**
- Rotate to landscape for better view
- Use horizontal scroll on tables

## 📞 Need Help?

1. Check the full README.md
2. Review browser console (F12 → Console)
3. Try exporting and re-importing data
4. Clear browser cache and reload

---

**Enjoy managing your tournaments! 🏆**
