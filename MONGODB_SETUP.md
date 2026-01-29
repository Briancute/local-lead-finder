# 🔧 MongoDB Atlas Setup Guide

Your LeadFinder app now uses **MongoDB** instead of PostgreSQL for much easier cloud deployment!

## Why MongoDB Atlas?

✅ **100% Free Tier** - 512MB storage, perfect for starting  
✅ **No Local Installation** - Works immediately  
✅ **Cloud Database** - Same DB for development AND production  
✅ **Easy Deployment** - Works with Netlify, Vercel, Render  
✅ **Already Running** - Just connect and go!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Free MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google or Email (100% free)
3. Choose **M0 FREE** tier
4. Select cloud provider: **AWS**
5. Region: Choose closest to you (e.g., Singapore for Asia)
6. Cluster Name: `leadfinder` (or anything you like)
7. Click **Create Cluster** (takes 1-3 minutes)

### Step 2: Create Database User

1. Click **Database Access** (left sidebar)
2. Click **+ ADD NEW DATABASE USER**
3. Authentication Method: **Password**
4. Username: `leadfinder_user`
5. Password: Click **Autogenerate Secure Password** → **Copy it!**
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 3: Allow Network Access

1. Click **Network Access** (left sidebar)
2. Click **+ ADD IP ADDRESS**
3. Click **ALLOW ACCESS FROM ANYWHERE** (for development)
4. Click **Confirm**

### Step 4: Get Connection String

1. Click **Database** (left sidebar)
2. Click **Connect** button on your cluster
3. Choose **Drivers**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://leadfinder_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Update `.env` File

1. Open `.env` file in your project root
2. Replace `<password>` in the connection string with the password you copied in Step 2
3. Add `/leadfinder` before the `?` to specify database name:

```env
MONGODB_URI=mongodb+srv://leadfinder_user:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/leadfinder?retryWrites=true&w=majority
```

**Example:**
```env
MONGODB_URI=mongodb+srv://leadfinder_user:abc123XYZ@cluster0.ab12cd.mongodb.net/leadfinder?retryWrites=true&w=majority
```

### Step 6: Start the Server!

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on http://localhost:5000
💾 Database: MongoDB
```

---

## ✅ That's It!

Your database is now running in the cloud! 

**Test it:**
1. Go to `http://localhost:5173/register`
2. Create an account
3. Search for leads!

---

## 💡 Troubleshooting

**Error: "MongooseServerSelectionError"**
- Check your connection string in `.env`
- Make sure you replaced `<password>` with actual password
- Verify Network Access allows your IP

**Error: "Authentication failed"**
- Double-check username and password in connection string
- Make sure password doesn't have special characters like `@` or `&`
- If it does, URL-encode them (or generate new password without special chars)

**Want to view your data?**
1. Go to MongoDB Atlas dashboard
2. Click **Browse Collections**
3. See all your users, leads, templates!

---

## 🌍 Production Deployment

When deploying to production (Netlify/Vercel/Render):

1. Add `MONGODB_URI` as environment variable in your hosting platform
2. Use the SAME connection string
3. That's it! Your cloud database works everywhere!

---

## 🎉 Benefits You Now Have

- ✅ No PostgreSQL installation needed
- ✅ Works on Windows, Mac, Linux
- ✅ Cloud backups automatic
- ✅ Easy to scale later
- ✅ Visual database browser
- ✅ Free forever (for small projects)

**Your app is now production-ready!** 🚀
