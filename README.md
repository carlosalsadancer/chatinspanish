# Chat in Spanish — chatinspanish.com

**The only Spanish course that listens back.**

## 🚀 Deploy to Vercel — Step by Step

### Step 1 — Create a GitHub account (if you don't have one)
Go to github.com and create a free account.

### Step 2 — Create a new repository
1. Click the "+" button → "New repository"
2. Name it: `chatinspanish`
3. Set to Public
4. Click "Create repository"

### Step 3 — Upload this project
1. In your new repository click "uploading an existing file"
2. Drag and drop ALL files from this ZIP
3. Click "Commit changes"

### Step 4 — Deploy to Vercel
1. Go to vercel.com
2. Sign up with your GitHub account
3. Click "Add New Project"
4. Select your `chatinspanish` repository
5. Click "Deploy"
6. Wait ~2 minutes ✅

### Step 5 — Connect your domain
1. In Vercel → your project → Settings → Domains
2. Type: chatinspanish.com
3. Click Add
4. Vercel will show you 2 DNS records

### Step 6 — Add DNS records to your domain provider
Add the 2 records that Vercel gives you in your domain control panel.

### Step 7 — Wait
DNS propagation takes 15 minutes to 48 hours.
After that: chatinspanish.com is LIVE! 🎉

---

## 📁 Project Structure
```
chatinspanish/
├── public/
│   ├── favicon.svg
│   ├── img_tacos.png        ← Hero image
│   ├── img_frustrated.png   ← Problem 1
│   ├── img_airport.png      ← Problem 2
│   ├── img_bored.png        ← Problem 3
│   └── img_phones.png       ← Guarantee section
├── src/
│   ├── main.jsx
│   └── App.jsx              ← Landing page
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 🛠️ Local Development
```bash
npm install
npm run dev
```
Open http://localhost:5173

## 📞 Support
contact@chatinspanish.com
