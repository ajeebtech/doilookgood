import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SunIcon, MoonIcon } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { user, signOut: authSignOut } = useAuth();
  const router = useRouter();

  const suggestedPrompts = [
    'ask for general looksmaxxing advice',
    'style my outfit for a date',
    'i want to look like.....',
  ];

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await authSignOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm here to help! How can I assist you today?",
          isUser: false,
        };
        setMessages(prev => [...prev, aiResponse]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);
    }
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#000000'],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  const textSecondaryColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#666666', '#999999'],
  });

  const inputBgColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F8F8F8', '#1A1A1A'],
  });

  const messageBubbleUserColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  const messageBubbleUserTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#000000'],
  });

  const messageBubbleAiColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F5F5F5', '#1A1A1A'],
  });

  const messageBubbleAiTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  const sendButtonInactiveColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#333333'],
  });

  const sendButtonInactiveTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#999999', '#666666'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
        {/* Simple Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.View style={[styles.logoCircle, { backgroundColor: textColor }]} />
            {user && (
              <Animated.Text style={[styles.userEmail, { color: textColor }]}>
                {user.email}
              </Animated.Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.darkModeToggle}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <SunIcon size={24} color="#FFFFFF" />
              ) : (
                <MoonIcon size={24} color="#000000" />
              )}
            </TouchableOpacity>
            {user && (
              <TouchableOpacity 
                style={styles.signOutButton}
                onPress={handleSignOut}
              >
                <Animated.Text style={[styles.signOutText, { color: textColor }]}>
                  Sign Out
                </Animated.Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      {/* Messages Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Animated.Text style={[styles.welcomeText, { color: textColor }]}>
                how would you like to look today?
              </Animated.Text>
              <View style={styles.promptsContainer}>
                {suggestedPrompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setInputText(prompt)}
                  >
                    <Animated.View style={[styles.promptCard, { backgroundColor: inputBgColor }]}>
                      <Animated.Text style={[styles.promptText, { color: textSecondaryColor }]}>
                        {prompt}
                      </Animated.Text>
                    </Animated.View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.isUser && styles.userMessageRow,
                ]}
              >
                <Animated.View
                  style={[
                    styles.messageBubble,
                    message.isUser 
                      ? { backgroundColor: messageBubbleUserColor, borderBottomRightRadius: 4 }
                      : { backgroundColor: messageBubbleAiColor, borderBottomLeftRadius: 4 },
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.messageText,
                      { color: message.isUser ? messageBubbleUserTextColor : messageBubbleAiTextColor },
                    ]}
                  >
                    {message.text}
                  </Animated.Text>
                </Animated.View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Minimalist Input */}
        <Animated.View style={[styles.inputContainer, { backgroundColor }]}>
          <Animated.View style={[styles.inputWrapper, { backgroundColor: inputBgColor }]}>
            <TextInput
              style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}
              placeholder="Message..."
              placeholderTextColor={isDarkMode ? '#666666' : '#A0A0A0'}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              textAlignVertical="center"
            />
            <Animated.View
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? textColor : sendButtonInactiveColor }
              ]}
            >
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim()}
                style={styles.sendButtonTouchable}
              >
                <Animated.Text style={[styles.sendIcon, { color: inputText.trim() ? backgroundColor : sendButtonInactiveTextColor }]}>
                  →
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  darkModeToggle: {
    padding: 4,
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 24,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#000',
    marginBottom: 48,
    textAlign: 'center',
  },
  promptsContainer: {
    width: '100%',
    gap: 12,
  },
  promptCard: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 16,
    fontWeight: '400',
  },
  messageRow: {
    marginBottom: 20,
  },
  userMessageRow: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sendButtonTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
});
