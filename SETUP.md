# Tournament Generator - Setup & Deployment Guide

## 📦 What You Have

Your `tournament-generator` folder contains:

```
tournament-generator/
├── index.html           Main HTML file (entry point)
├── styles.css          All styling & responsive design
├── app.js              Core JavaScript logic
├── README.md           Full documentation
├── QUICKSTART.md       Quick start guide
├── SETUP.md            This file
├── .gitignore          Git ignore rules
└── _config.yml         GitHub Pages configuration
```

**Total Size**: ~50 KB (super lightweight!)

## 🚀 Local Testing (Before GitHub)

### Option 1: Direct Browser (Easiest)
1. Open File Explorer
2. Navigate to `tournament-generator` folder
3. Double-click `index.html`
4. App opens in your default browser
5. Test all features locally

### Option 2: VS Code Live Server (Recommended)
1. Open the `tournament-generator` folder in VS Code
2. Install "Live Server" extension (by Ritwick Dey)
3. Right-click `index.html` → "Open with Live Server"
4. Browser opens automatically at `http://localhost:5500`
5. Changes refresh automatically

### Option 3: Python Server (If you have Python)
```bash
cd tournament-generator
python -m http.server 8000
```
Then open: `http://localhost:8000`

## 📤 Deploy to GitHub Pages

### Prerequisites
- GitHub account (free at github.com)
- Git installed on your computer
- Your folder ready to push

### Step-by-Step Deployment

#### 1️⃣ Create GitHub Repository
```
1. Go to github.com
2. Click "+" icon → "New repository"
3. Name it: tournament-generator
4. Description: "Tournament management app"
5. Select Public (required for GitHub Pages)
6. Click "Create repository"
```

#### 2️⃣ Initialize Git (First Time Only)
```bash
cd tournament-generator
git init
git add .
git commit -m "Initial commit: Tournament Generator app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tournament-generator.git
git push -u origin main
```

#### 3️⃣ Enable GitHub Pages
```
1. Go to your repository on GitHub
2. Click "Settings" tab (top right)
3. Click "Pages" in left sidebar
4. Under "Source", select:
   - Branch: main
   - Folder: / (root)
5. Click "Save"
6. GitHub builds the site (takes ~1-2 minutes)
7. You'll see: "Your site is live at https://USERNAME.github.io/tournament-generator"
```

#### 4️⃣ Access Your App
- Visit: `https://YOUR_USERNAME.github.io/tournament-generator`
- Share this URL with others
- Bookmark it!

### ✅ Verification Checklist
- [ ] Repository shows all 7 files
- [ ] Settings → Pages shows deployment successful
- [ ] URL is accessible
- [ ] App loads in browser
- [ ] localStorage saves data
- [ ] Tournament creation works

## 🔄 Making Updates

After you've deployed, to update your app:

```bash
cd tournament-generator
# Make your changes to files
git add .
git commit -m "Update: describe your change"
git push origin main
```

GitHub automatically rebuilds your site within minutes.

## 🎨 Common Customizations

### Change App Title
In `index.html`, line 6:
```html
<title>My Tournament App</title>
```

### Change Header
In `index.html`, find:
```html
<h1>🏆 Tournament Generator</h1>
<p>Create and manage tournaments with ease</p>
```

### Change Colors
In `styles.css`, find `:root` section (~line 18):
```css
:root {
    --primary: #6366f1;           /* Main purple */
    --secondary: #8b5cf6;         /* Lighter purple */
    --success: #10b981;           /* Green */
    --danger: #ef4444;            /* Red */
    /* ... more colors ... */
}
```

### Increase Player Limit
In `app.js`, search for `>= 64`:
```javascript
if (this.state.players.length >= 64) {
    this.showError('Maximum 64 players allowed');
    return;
}
```
Change `64` to your desired limit.

### Custom Domain (Optional)
To use your own domain instead of github.io:

1. Buy domain (GoDaddy, Namecheap, etc.)
2. Create file `CNAME` in root:
   ```
   yourdomain.com
   ```
3. Push to GitHub
4. Configure DNS at your registrar (Point to GitHub Pages IP)
5. GitHub will auto-configure HTTPS

## 📋 File-by-File Explanation

### index.html (6 KB)
- Complete HTML structure
- All form elements
- Modal dialogs
- Links to CSS and JS

### styles.css (12 KB)
- Mobile-first responsive design
- CSS Grid & Flexbox layouts
- Color scheme (CSS variables)
- Animations & transitions
- Works in all modern browsers

### app.js (22 KB)
- Main `TournamentApp` object
- Tournament logic (knockout, league, round-robin)
- localStorage persistence
- Score entry & updates
- Standing calculations

### README.md (5.5 KB)
- Complete documentation
- Feature list
- How to use guide
- Customization tips

### QUICKSTART.md (3.3 KB)
- Quick reference guide
- Common questions
- Troubleshooting

### _config.yml (0.4 KB)
- GitHub Pages configuration
- Optional but recommended

### .gitignore (0.2 KB)
- Tells Git which files to ignore

## 🐛 Debugging

### Check browser console for errors:
1. Press F12 (or right-click → Inspect)
2. Click "Console" tab
3. Look for red error messages
4. Fix issues in code

### Check localStorage:
1. Press F12
2. Click "Application" tab
3. Click "LocalStorage"
4. Look for "tournament" key
5. Click it to see saved data

### Clear all data:
```javascript
// In browser console:
localStorage.clear()
```

## 📞 Support Resources

- **GitHub Pages Docs**: pages.github.com
- **Git Guide**: github.com/git-tips/tips
- **MDN Web Docs**: developer.mozilla.org
- **VS Code Docs**: code.visualstudio.com/docs

## 🎓 Learning Notes

This project uses:
- **HTML5**: Semantic structure
- **CSS3**: Flexbox, Grid, Custom Properties (CSS Variables)
- **ES6+ JavaScript**: Arrow functions, async/await, destructuring
- **Browser APIs**: localStorage, fetch, File API

No frameworks, no dependencies, pure web standards!

## ✨ Pro Tips

1. **Backup tournaments**: Export before major changes
2. **Version control**: Commit before large updates
3. **Test locally**: Always test in browser before pushing
4. **Keep README updated**: Document any customizations
5. **Share thoughtfully**: Don't put sensitive data online

## 🎉 You're All Set!

Your tournament generator is now:
- ✅ Fully functional
- ✅ Deployed to the web
- ✅ Shareable with anyone
- ✅ Backed by GitHub Pages (free hosting forever)
- ✅ Production-ready

Enjoy creating tournaments! 🏆

---

**Next Steps:**
1. Test locally (open index.html)
2. Deploy to GitHub (follow Step-by-Step above)
3. Share your GitHub Pages URL
4. Start hosting tournaments!
