import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { SongModal } from "@/components/SongModal";
import { useSongs } from "@/context/SongContext";
import AddInfoText from "@/components/AddInfoText";
import * as FileSystem from "expo-file-system";

export default function AddScreen() {
  const db = useSQLiteContext();
  const { setReload } = useSongs();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);

  const searchSongs = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.deezer.com/search/track?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data && data.data) {
        setResults(data.data);
        if (data.data.length === 0) {
          setNoResults(true);
        }
      } else {
        setResults([]);
        if (data.data.length === 0) {
          setNoResults(true);
        }
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      setResults([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setResults([]);
      setNoResults(false);
    }
  };

  const handleSaveSong = async (songData: {
    title: string;
    artist: string;
    album: string;
    albumCover: string;
  }) => {
    var fileName = `${songData.title.toLocaleLowerCase()}-${songData.artist.toLocaleLowerCase()}`;
    fileName += Math.floor(Math.random() * 1000000);
    fileName += songData.albumCover.substring(
      songData.albumCover.lastIndexOf(".")
    );
    fileName = fileName.replace(/[^a-z0-9.]/gi, "_"); // special characters cleaning
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.downloadAsync(songData.albumCover, filePath);
    } catch (error) {
      ToastAndroid.show(
        "Error while downloading album cover",
        ToastAndroid.SHORT
      );
    }
    await db.runAsync(
      `INSERT INTO songs (title, artist, album, albumCover) VALUES (?, ?, ?, ?)`,
      [songData.title, songData.artist, songData.album, fileName!]
    );
    ToastAndroid.show("Successfully added song!", ToastAndroid.LONG);
    setReload({});
    setModalVisible(false);
    clearSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.addTitle}>
        <Text style={styles.titleText}>
          <Text style={styles.oneText}>add </Text>
          <Text style={styles.andThisText}>one more</Text>
        </Text>
      </View>

      <View style={styles.containerDivider}>
        <View style={styles.divider} />
      </View>
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#09a9a9"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by song, artist or album..."
          placeholderTextColor="#A9A9A9"
          value={query}
          onChangeText={handleInputChange}
          onSubmitEditing={searchSongs}
        />
        {query.trim() !== "" && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <MaterialIcons name="clear" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedSong(item);
              setModalVisible(true);
            }}
          >
            <View style={styles.resultItem}>
              <Image
                source={{ uri: item.album.cover_small }}
                style={styles.albumCover}
              />
              <View style={styles.textContainer}>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.artistName}>{item.artist.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && query && noResults ? (
            <Text style={styles.emptyText}>No results found</Text>
          ) : (
            <AddInfoText />
          )
        }
      />
      {selectedSong && (
        <SongModal
          song={selectedSong}
          visible={modalVisible}
          onSave={handleSaveSong}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

// --------------------- Styles ----------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  addTitle: {
    backgroundColor: "#151718",
    width: "100%",
    alignItems: "center",
    paddingBottom: 16,
    paddingTop: 26,
  },
  titleText: {
    fontSize: 45,
    fontWeight: "bold",
  },
  andThisText: {
    color: "#b7adcf",
    fontStyle: "normal",
    fontVariant: ["small-caps"],
  },
  oneText: {
    color: "#09A9A9",
    fontStyle: "normal",
    fontVariant: ["small-caps"],
  },
  signText: {
    fontSize: 36,
    color: "#b7adcf",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
    justifyContent: "center",
  },

  searchIcon: {
    marginRight: 8,
    alignSelf: "center",
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: "#b7adcf",
    padding: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  containerDivider: {
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
    width: "100%",
  },
  divider: {
    height: 2,
    backgroundColor: "#b7adcf",
    marginBottom: 16,
    width: "98.5%",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  songTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    color: "#A9A9A9",
    fontSize: 14,
  },
  emptyText: {
    color: "#A9A9A9",
    textAlign: "center",
    marginTop: 16,
  },
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
  },
  modalAlbumCover: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
  },
  modalInput: {
    backgroundColor: "#1C1C1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalPicker: {
    color: "#FFFFFF",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    marginBottom: 16,
  },
});
