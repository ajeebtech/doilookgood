import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { supabase, signInWithGoogle } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/chat');
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { url } = await signInWithGoogle();
      
      if (url) {
        const redirectUrl = 'lookgood://auth/callback';
        
        const result = await WebBrowser.openAuthSessionAsync(
          url,
          redirectUrl
        );

        if (result.type === 'success' && result.url) {
          // Extract the URL from the result
          const responseUrl = result.url;
          
          // Parse the URL to get the session tokens
          const urlObj = new URL(responseUrl);
          const access_token = urlObj.searchParams.get('access_token') || 
                               urlObj.hash.match(/access_token=([^&]*)/)?.[1];
          const refresh_token = urlObj.searchParams.get('refresh_token') || 
                                urlObj.hash.match(/refresh_token=([^&]*)/)?.[1];

          if (access_token && refresh_token) {
            // Set the session in Supabase
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) throw error;

            router.replace('/chat');
          } else {
            throw new Error('No authentication tokens received');
          }
        } else if (result.type === 'cancel') {
          Alert.alert('Cancelled', 'Sign in was cancelled');
        }
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Sign in to continue</Text>

        {/* Google Button */}
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Forgot Password Button - Bypass Auth */}
        <TouchableOpacity 
          style={styles.forgotPasswordButton}
          onPress={() => router.replace('/chat')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password? (Dev Mode)</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#000',
    borderRadius: 50,
    transform: [{ scaleX: 0.7 }],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 48,
    color: '#000',
  },
  googleButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  googleIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: '700',
    color: '#fff',
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  forgotPasswordButton: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
});
