import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Button,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SongModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (songData: { title: string; artist: string; genre: string }) => void;
  song: any;
}

export const SongModal: React.FC<SongModalProps> = ({
  visible,
  onClose,
  onSave,
  song,
}) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("Rock");
  const [albumCover, setAlbumCover] = useState("");

  useEffect(() => {
    setTitle(song.title);
    setArtist(song.artist.name);
    setAlbumCover(song.album.cover_medium);
  }, [song]);

  const handleSave = () => {
    onSave({ title, artist, genre });
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
              {albumCover ? (
                <Image
                  source={{ uri: albumCover }}
                  style={styles.modalAlbumCover}
                />
              ) : null}

              <TextInput
                style={styles.modalInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Song Title"
                placeholderTextColor="#A9A9A9"
              />
              <TextInput
                style={styles.modalInput}
                value={artist}
                onChangeText={setArtist}
                placeholder="Artist Name"
                placeholderTextColor="#A9A9A9"
              />
              <Picker
                selectedValue={genre}
                style={styles.modalPicker}
                onValueChange={(itemValue) => setGenre(itemValue)}
              >
                <Picker.Item label="Rock" value="Rock" />
                <Picker.Item label="Pop" value="Pop" />
                <Picker.Item label="Hip Hop" value="Hip Hop" />
                <Picker.Item label="Jazz" value="Jazz" />
                <Picker.Item label="Classical" value="Classical" />
              </Picker>
              <Button title="Save" onPress={handleSave} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#2C2C2E",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalAlbumCover: {
    width: 150,
    height: 150,
    borderRadius: 75, // This makes the image circular
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#1C1C1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    width: "100%",
  },
  modalPicker: {
    color: "#FFFFFF",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    marginBottom: 16,
    width: "100%",
  },
});

export default SongModal;
