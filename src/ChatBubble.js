import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ChatBubble = ({ role, text, image, onSpeech }) => {
  return (
    <View
      style={[
        styles.chatItem,
        role === "user" ? styles.userChatItem : styles.modelChatItem,
      ]}
    >
      {image && <Image source={image} style={styles.chatImage} />}
      <Text style={styles.chatText}>{text}</Text>
      {role === "model" && (
        <TouchableOpacity onPress={onSpeech} style={styles.speakerIcon}>
          <Ionicons name="volume-high-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    position: "relative",
  },
  userChatItem: {
    alignSelf: "flex-end",
    backgroundColor: "#0074FF",
  },
  modelChatItem: {
    alignSelf: "flex-start",
    backgroundColor: "#333",
  },
  chatText: {
    fontSize: 16,
    color: "#fff",
  },
  speakerIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default ChatBubble;
