import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import { speak, isSpeakingAsync, stop } from "expo-speech";

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollViewRef = useRef(null);

  const API_KEY = "AIzaSyA_MqjxNyU-H5yqvl8uu0mUWOKYeEVaTpw"; // Ensure your API key is securely stored

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    let updatedChat = [
      ...chat,
      { role: "user", parts: [{ text: userInput }] },
    ];

    setChat(updatedChat);
    setUserInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        { contents: updatedChat }
      );

      console.log("API Response:", response.data);

      const modelResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";

      setChat([...updatedChat, { role: "model", parts: [{ text: modelResponse }] }]);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = async (text) => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/chatBackground/background3.jpeg")} 
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>InSnip Chatbot</Text>
          </View>

          <ScrollView 
            style={styles.chatScrollView} 
            contentContainerStyle={styles.chatContainer}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          >
            {chat.map((item, index) => (
              <ChatBubble
                key={index}
                role={item.role}
                text={item.parts[0].text}
                onSpeech={() => handleSpeech(item.parts[0].text)}
              />
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#aaa"
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={handleUserInput}
            />
            <TouchableOpacity style={styles.button} onPress={handleUserInput}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator style={styles.loading} color="#333" />}
          {error && <Text style={styles.error}>{error}</Text>}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    marginTop: -20,
    paddingHorizontal: 5,
    paddingVertical: 25,
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    width: "100%",
    height: "10%",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 30,
  },
  chatScrollView: {
    flex: 1,
  },
  chatContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 25,
    color: "#333",
    backgroundColor: "#fff",
  },
  button: {
    padding: 10,
    backgroundColor: "black",
    borderRadius: 25,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  loading: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Chatbot;