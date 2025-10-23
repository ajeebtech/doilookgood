# Fix Google OAuth Redirect Issue

## The Problem
After signing in with Google, you get stuck in the browser because it doesn't know how to redirect back to your app.

## The Solution
Add your app's custom URL scheme to Supabase's allowed redirect URLs.

## Steps:

### 1. Go to your Supabase Dashboard
URL: https://supabase.com/dashboard/project/nrahspjgazcxmeqptoxd

### 2. Navigate to Authentication Settings
- Click **Authentication** in the left sidebar
- Click **URL Configuration**

### 3. Add Redirect URLs
In the **Redirect URLs** section, add this URL:

```
lookgood://auth/callback
```

**Important:** Make sure to click **Save** after adding the URL!

### 4. Also verify your Site URL
The Site URL should be set to:
```
lookgood://
```

### 5. Restart your app
After saving the changes in Supabase:
1. Close your app completely
2. Restart the Expo server (press 'r' in the terminal)
3. Open the app again
4. Try Google sign-in

## What Changed in the Code

✅ Updated redirect URL to use `lookgood://` scheme
✅ Improved token extraction (checks both query params and hash)
✅ Better error handling
✅ Added cancel detection

## Testing

After adding the redirect URL:
1. Tap "Continue with Google"
2. Sign in with your Google account
3. You should be **automatically redirected back to the app**
4. You should land on the chat screen

If you still have issues, check the Expo terminal for any error messages.

