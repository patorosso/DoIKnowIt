import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";

interface SongModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (songData: {
    title: string;
    artist: string;
    album: string;
    albumCover: string;
  }) => void;
  onDelete?: () => void;
  song: any;
  editMode?: boolean;
}

export const SongModal: React.FC<SongModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  song,
  editMode = false,
}) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [albumCover, setAlbumCover] = useState("");

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist.name);
      setAlbum(song.album.title);
      if (song.album.cover_medium.startsWith("http")) {
        setAlbumCover(song.album.cover_medium);
      } else {
        setAlbumCover(
          `${FileSystem.documentDirectory}${song.album.cover_medium}`
        );
      }
    }
  }, [song]);

  const handleUpdate = () => {
    onSave({ title, artist, album, albumCover });
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Album Cover */}
              {albumCover ? (
                <Image
                  source={{ uri: albumCover }}
                  style={styles.modalAlbumCover}
                />
              ) : null}

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Song Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter song name"
                  placeholderTextColor="#A9A9A9"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Artist</Text>
                <TextInput
                  style={styles.modalInput}
                  value={artist}
                  onChangeText={setArtist}
                  placeholder="Enter artist name"
                  placeholderTextColor="#A9A9A9"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Album</Text>
                <TextInput
                  style={styles.modalInput}
                  value={album}
                  onChangeText={setAlbum}
                  placeholder="Enter album name"
                  placeholderTextColor="#A9A9A9"
                />
              </View>

              {/* Buttons */}
              {editMode ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.updateButton]}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={onDelete}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdate}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ---------------- Styles ----------------

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1C1C1E",
    padding: 27,
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalAlbumCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 32,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#A9A9A9",
    fontSize: 13,
    paddingLeft: 8,
    fontWeight: "600",
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: "#1C1C1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "grey",
    width: "100%",
  },
  pickerContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
  },
  modalPicker: {
    color: "#FFFFFF",
    width: "100%",
    height: 60,
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: "#09A9A9",
    borderRadius: 10,
    marginTop: 16,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  button: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#09A9A9",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
