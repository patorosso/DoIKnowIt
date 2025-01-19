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
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isModified, setIsModified] = useState(false);

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

  useEffect(() => {
    if (
      song &&
      (title !== song.title ||
        artist !== song.artist.name ||
        album !== song.album.title)
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [title, artist, album, song]);

  const handleUpdate = () => {
    onSave({ title, artist, album, albumCover });
    onClose();
  };

  const confirmDelete = () => {
    if (onDelete) onDelete();
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
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
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {albumCover ? (
                  <Image
                    source={{ uri: albumCover }}
                    style={styles.modalAlbumCover}
                  />
                ) : null}

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

                {editMode ? (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.updateButton,
                        !isModified && styles.disabledButton,
                      ]}
                      onPress={handleUpdate}
                      disabled={!isModified}
                    >
                      <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.deleteButton]}
                      onPress={() => setShowConfirmation(true)}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationText}>
              Are you sure you want to delete this song?
            </Text>
            <View style={styles.confirmationButtonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmDeleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  confirmationModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  confirmationModalContent: {
    width: "80%",
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmationText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  confirmationButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#A9A9A9",
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  confirmDeleteButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
});
