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

export default function HomeScreen() {
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

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#000000'],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  const secondaryTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#666666', '#999999'],
  });

  const inputBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F5F5F5', '#1A1A1A'],
  });

  const userBubbleColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  const aiBubbleColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F5F5F5', '#1A1A1A'],
  });

  const sendButtonColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

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

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm here to help you look your best! What would you like advice on?",
          isUser: false,
        };
        setMessages(prev => [...prev, aiResponse]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
  };

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
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Animated.Text style={[styles.greeting, { color: textColor }]}>
                how would you like to look today?
              </Animated.Text>
              <View style={styles.promptsContainer}>
                {suggestedPrompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.promptCard}
                    onPress={() => handlePromptSelect(prompt)}
                  >
                    <Animated.View style={[styles.promptCardInner, { backgroundColor: inputBackgroundColor }]}>
                      <Animated.Text style={[styles.promptText, { color: secondaryTextColor }]}>
                        {prompt}
                      </Animated.Text>
                    </Animated.View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            messages.map((message) => (
              <View key={message.id} style={styles.messageRow}>
                <Animated.View
                  style={[
                    styles.messageBubble,
                    message.isUser 
                      ? [styles.userMessage, { backgroundColor: userBubbleColor }]
                      : [styles.aiMessage, { backgroundColor: aiBubbleColor }],
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.messageText,
                      message.isUser 
                        ? { color: isDarkMode ? '#000000' : '#FFFFFF' }
                        : { color: textColor },
                    ]}
                  >
                    {message.text}
                  </Animated.Text>
                </Animated.View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Area */}
        <Animated.View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
          <View style={styles.inputWrapper}>
            <Animated.View style={[styles.input, { backgroundColor: inputBackgroundColor }]}>
              <TextInput
                style={[styles.textInput, { color: textColor.toString() }]}
                placeholder="what's up..."
                placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={2000}
                textAlignVertical="center"
              />
            </Animated.View>
            <Animated.View style={[styles.sendButton, { backgroundColor: sendButtonColor }]}>
              <TouchableOpacity
                style={styles.sendButtonTouchable}
                onPress={handleSend}
                disabled={!inputText.trim()}
              >
                <Text style={[styles.sendIcon, { color: isDarkMode ? '#000000' : '#FFFFFF' }]}>
                  ↑
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
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
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 48,
    textAlign: 'center',
  },
  promptsContainer: {
    width: '100%',
    gap: 16,
  },
  promptCard: {
    width: '100%',
  },
  promptCardInner: {
    padding: 20,
    borderRadius: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  promptText: {
    fontSize: 16,
    textAlign: 'center',
  },
  messageRow: {
    marginBottom: 16,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 4,
    minHeight: 48,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    maxHeight: 120,
    textAlignVertical: 'center',
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
    fontWeight: '700',
  },
});
