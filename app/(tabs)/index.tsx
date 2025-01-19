import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSQLiteContext } from "expo-sqlite";
import { useSongs } from "@/context/SongContext";
import { useEffect, useState } from "react";
import { Song } from "@/constants/Types";
import {
  getImageSource,
  groupSongs,
  handleTitleTextLengthStyle,
} from "@/functions/homeScreen";

export default function TabOneScreen() {
  const db = useSQLiteContext();
  const { reload } = useSongs();
  const [songs, setSongs] = useState<Song[]>([]);
  const [groupedBy, setGroupedBy] = useState<"artist" | "genre" | "title">(
    "artist"
  );

  useEffect(() => {
    const fetchSongs = async () => {
      const dbSongs = await db.getAllAsync<Song>("SELECT * FROM songs");

      const songsWithImages = await Promise.all(
        dbSongs.map(async (song) => ({
          ...song,
          localImageSource: await getImageSource(song.albumCover),
        }))
      );

      setSongs(songsWithImages);
    };

    fetchSongs();
  }, [reload]);

  const groupedSongs = groupSongs(groupedBy, songs);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sortingContainer}>
        <Text style={styles.mainText}>Do I know it?</Text>
        <View
          style={{
            height: 1,
            backgroundColor: "#A9A9A9",
            marginBottom: 16,
            width: "100%",
          }}
        />

        <View style={styles.chipContainer}>
          <TouchableOpacity
            style={[styles.chip, groupedBy === "artist" && styles.activeChip]}
            onPress={() => setGroupedBy("artist")}
          >
            <Text
              style={[
                styles.chipText,
                groupedBy === "artist" && styles.activeChipText,
              ]}
            >
              Artist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, groupedBy === "title" && styles.activeChip]}
            onPress={() => setGroupedBy("title")}
          >
            <Text
              style={[
                styles.chipText,
                groupedBy === "title" && styles.activeChipText,
              ]}
            >
              Song Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, groupedBy === "genre" && styles.activeChip]}
            onPress={() => setGroupedBy("genre")}
          >
            <Text
              style={[
                styles.chipText,
                groupedBy === "genre" && styles.activeChipText,
              ]}
            >
              Genre
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={groupedSongs}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [groupName, songs] = item;
          return (
            <View style={styles.groupBox}>
              <Text style={styles.groupTitle}>{groupName}</Text>
              {songs.map((song) => (
                <View key={song.id} style={styles.songItem}>
                  <Image
                    source={song.localImageSource}
                    style={styles.songImage}
                  />
                  <View style={styles.songName}>
                    <Text style={handleTitleTextLengthStyle(song.title)}>
                      {song.title}
                    </Text>
                    <Text style={styles.songArtist}>{song.artist}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        }}
      />
      {/* <Text style={styles.sortingText}>
      Pato can play anything on this list
    </Text>
    <Text style={styles.sortingTextSubtitle}>
      (If you don't find what you want, ask him to learn it)
    </Text> */}
    </SafeAreaView>
  );
}

// --------------------- Styles ----------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
    paddingTop: 60,
  },
  sortingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mainText: {
    color: "#FFFFFF",
    fontSize: 30,
    marginBottom: 8,
  },
  sortingText: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 8,
  },
  sortingTextSubtitle: {
    color: "#FFFFFF",
    fontSize: 10,
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 0,
  },
  chip: {
    backgroundColor: "#3C3C3E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: "#007AFF",
  },
  chipText: {
    color: "#A9A9A9",
    fontSize: 14,
    fontWeight: "500",
  },
  activeChipText: {
    color: "#FFFFFF",
  },
  groupBox: {
    backgroundColor: "#1b1b1c",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 12,
    fontWeight: "bold",
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#1b1b1c",
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  songName: {
    backgroundColor: "#1b1b1c",
  },
  songArtist: {
    color: "#A9A9A9",
    fontSize: 14,
  },
});
