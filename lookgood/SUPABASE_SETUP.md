# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Save your project URL and anon key

## 2. Configure Environment Variables

Create a `.env.local` file in the `lookgood` directory with your Supabase credentials:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

## 3. Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** provider
4. Add your OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console

### Getting Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
7. Copy the Client ID and Client Secret to Supabase

## 4. Configure Redirect URLs in Supabase

In your Supabase project settings:

1. Go to **Authentication** > **URL Configuration**
2. Add your redirect URLs:
   - For development: `exp://localhost:19000` or your Expo dev URL
   - For production: `lookgood://` (your custom scheme)

## 5. Update app.json (if needed)

The `app.json` already has the scheme configured as `lookgood`. Make sure it matches your OAuth redirect configuration.

## 6. Test the Integration

1. Start your Expo app:
   ```bash
   npm start
   ```

2. Try signing in with:
   - Email (magic link)
   - Google OAuth

## Features Implemented

✅ **Email Magic Link Authentication**
- Enter email and receive a magic link
- Click link to sign in automatically

✅ **Google OAuth**
- Sign in with Google account
- Seamless redirect back to app

✅ **Session Management**
- Automatic session persistence
- Check session on app load
- Protected routes

✅ **Sign Out**
- Sign out button in chat header
- Clears session and redirects to login

## Troubleshooting

### Issue: Google Sign-In doesn't work
- Check that redirect URLs are correctly configured in both Google Console and Supabase
- Ensure the Google provider is enabled in Supabase
- Verify your OAuth credentials are correct

### Issue: Session not persisting
- Check that AsyncStorage is properly installed
- Clear app data and try again

### Issue: "Invalid API Key"
- Verify your `.env.local` file has the correct values
- Make sure you're using `EXPO_PUBLIC_` prefix for environment variables
- Restart your Expo dev server after changing environment variables

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Expo Authentication Guide](https://docs.expo.dev/guides/authentication/)

