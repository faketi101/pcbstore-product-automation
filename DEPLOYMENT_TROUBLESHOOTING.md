# Deployment Troubleshooting Guide

## 🚨 Quick Fix for 503 Error (Database connection error)

**Your issue:** MongoDB connection stuck in "connecting" state  
**Cause:** MongoDB Atlas is blocking your server's IP  

**Fix in 3 steps:**

1. **Get your server's IP:**
   ```bash
   curl ifconfig.me
   ```

2. **Add to MongoDB Atlas:**
   - Go to https://cloud.mongodb.com/
   - Network Access → Add IP Address
   - Enter: `0.0.0.0/0` (or your specific IP)
   - Wait 2-5 minutes

3. **Restart your app in cPanel**

---

## MongoDB Connection Stuck in "Connecting" State (Most Common Issue)

### Symptoms:
- `/api/health` shows `"state": 2` (connecting) instead of `"state": 1` (connected)
- Login returns 503 error: "Database connection error"
- Server logs show: "Attempting to connect to MongoDB..." but never completes

### Root Cause:
MongoDB Atlas is blocking your server's IP address.

### Solution:

**Step 1: Find Your Server's IP Address**
```bash
# SSH into your cPanel server and run:
curl ifconfig.me
# Or
curl icanhazip.com
# Or check in cPanel → Server Information
```

**Step 2: Add IP to MongoDB Atlas Whitelist**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your project
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Options:
   - **Recommended for testing**: Add `0.0.0.0/0` (allow from anywhere)
   - **Recommended for production**: Add your server's specific IP address
6. Click "Confirm"
7. **WAIT 2-5 minutes** for changes to propagate

**Step 3: Test Connection**
```bash
# In your backend directory:
node scripts/testMongoConnection.js
```

This script will:
- Test MongoDB connection
- Show detailed error messages
- Provide specific troubleshooting steps

**Step 4: Restart Your Application**
After adding the IP, restart your Node.js app in cPanel.

### Still Not Working?

Check these additional issues:

### 1. Check Environment Variables

Make sure all required environment variables are set in your cPanel Node.js application settings:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
SESSION_SECRET=your-strong-random-secret-here
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
COOKIE_SECURE=true  # Set to false if testing without HTTPS
```

**Important for cPanel:**
- Don't use `.env` file - set variables in cPanel Node.js App settings
- SESSION_SECRET must be set (strong random string)
- MONGODB_URI must be accessible from your server's IP
- FRONTEND_URL must match your actual domain

### 2. MongoDB Connection Issues

**Check if MongoDB allows connections from your server:**

1. Go to MongoDB Atlas → Network Access
2. Add your cPanel server's IP address or use `0.0.0.0/0` (not recommended for production)
3. Wait 2-5 minutes for changes to propagate

**Test MongoDB connection:**
```bash
# SSH into your server and test
node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('Connected!')).catch(e => console.error(e))"
```

### 3. Session Store Configuration

The session store needs MongoDB to be connected. Common issues:

- **MongoDB URI incorrect**: Double-check username, password, cluster URL
- **Network timeout**: Server can't reach MongoDB (firewall/IP whitelist)
- **Connection string format**: Must be `mongodb+srv://` or `mongodb://`

### 4. Cookie/CORS Issues

For cPanel with HTTPS:
```env
NODE_ENV=production
COOKIE_SECURE=true
```

If testing without HTTPS (HTTP only):
```env
NODE_ENV=production
COOKIE_SECURE=false
```

**Frontend CORS Setup:**
Make sure your frontend `.env` has:
```env
VITE_API_URL=https://pcbserver.tarikul.dev
```

### 5. Check Server Logs

**In cPanel:**
1. Go to Node.js App
2. Click "Show Log"
3. Look for specific error messages

**Common errors you might see:**
- `MongooseServerSelectionError`: Can't connect to MongoDB
- `Session store error`: MongoDB connection for sessions failed
- `CORS blocked origin`: Frontend URL not in allowed origins

### 6. Debugging Steps

The updated code now includes better logging. Check your logs for:

```
Login attempt for: user@email.com
User found, comparing password...
Password valid, creating session...
Session save error: [details]
Login successful for: user@email.com
```

This will help identify exactly where the error occurs.

### 7. Quick Fixes to Try

**Option 1: Disable secure cookies temporarily**
```env
COOKIE_SECURE=false
```

**Option 2: Add detailed environment check**
Add this to your `server.js` startup:
```javascript
console.log('Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'MISSING');
console.log('- SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'MISSING');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('- COOKIE_SECURE:', process.env.COOKIE_SECURE);
```

**Option 3: Test database connection separately**
Create a test endpoint:
```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: process.env.NODE_ENV,
  });
});
```

Visit: `https://pcbserver.tarikul.dev/api/health`

### 8. cPanel-Specific Setup

1. **Node.js Version**: Use Node.js 16+ (recommended: 18 or 20)
2. **Application Mode**: Set to "Production"
3. **Application Root**: Point to your backend folder
4. **Application URL**: Your subdomain (e.g., pcbserver.tarikul.dev)
5. **Application Startup File**: `server.js`

### 9. Common cPanel Mistakes

- ❌ Forgot to set environment variables in cPanel
- ❌ Used localhost MongoDB instead of Atlas
- ❌ MongoDB IP whitelist doesn't include server IP
- ❌ SESSION_SECRET not set (defaults to weak secret)
- ❌ NODE_ENV not set to "production"
- ❌ FRONTEND_URL doesn't match actual frontend domain

### 10. Still Not Working?

If the above doesn't help, check these:

1. **Server Logs**: Look at full error stack trace
2. **MongoDB Atlas Logs**: Check for failed connection attempts
3. **Browser Console**: Check the full error response
4. **Network Tab**: Check request/response headers and cookies

### Testing Checklist

- [ ] MongoDB connection works from server
- [ ] All environment variables are set
- [ ] MongoDB IP whitelist includes server IP
- [ ] Frontend CORS origin matches
- [ ] Session store connects successfully
- [ ] Cookies are being set properly
- [ ] HTTPS/HTTP cookie settings match your setup

## Contact

If you need help, provide:
1. Full error logs from server
2. Browser console errors
3. Network tab screenshot showing the failed request
4. Your environment variable configuration (hide sensitive values)
