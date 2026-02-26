# BlindCall — Deploy in 5 Minutes

## Option A: Netlify (Drag & Drop — No CLI needed)

### Step 1 — Build on your computer
```bash
# Make sure Node.js is installed → nodejs.org
# Open terminal, go to this folder

npm install
npm run build
```
This creates a `/dist` folder.

### Step 2 — Deploy
1. Go to **netlify.com** → sign up free
2. On the dashboard click **"Add new site" → "Deploy manually"**
3. **Drag your `/dist` folder** into the upload box
4. Done. You get a live URL like `https://blindcall-abc123.netlify.app`

### Optional: Custom domain
In Netlify → Site settings → Domain management → Add your domain.

---

## Option B: Vercel (Best for sharing portfolio links)

```bash
npm install
npm install -g vercel
vercel
```
Follow the prompts. Live in 30 seconds with a `vercel.app` URL.

---

## Option C: GitHub + Vercel (Auto-deploys on every save)

```bash
git init
git add .
git commit -m "blindcall prototype"
gh repo create blindcall --public --push
```
Then go to vercel.com → Import GitHub repo → Deploy.
Every `git push` auto-redeploys.

---

## Local development
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```
"# blindcall" 
