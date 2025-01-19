import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useSongs } from "@/context/SongContext";
import { SongModal } from "@/components/SongModal";
import { Song } from "@/constants/Types";
import { getImageSource, groupSongs } from "@/functions/homeScreen";

export default function TabOneScreen() {
  const db = useSQLiteContext();
  const { reload, setReload } = useSongs();
  const [songs, setSongs] = useState<Song[]>([]);
  const [groupedBy, setGroupedBy] = useState<"artist" | "album" | "title">(
    "artist"
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleUpdateSong = async (updatedSong: any) => {
    await db.runAsync(
      `UPDATE songs SET title = ?, artist = ?, album = ? WHERE id = ?`,
      [
        updatedSong.title,
        updatedSong.artist,
        updatedSong.album,
        selectedSong?.id,
      ]
    );
    setModalVisible(false);
    setReload({});
  };

  const handleDeleteSong = async () => {
    await db.runAsync(`DELETE FROM songs WHERE id = ?`, [selectedSong?.id!]);
    setModalVisible(false);
    setReload({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sortingContainer}>
        <View style={styles.appTitle}>
          <Text style={styles.titleText}>
            <Text style={styles.doText}>do i </Text>
            <Text style={styles.knowText}>know</Text>
            <Text style={styles.doText}> it</Text>
            <Text style={styles.signText}> ?</Text>
          </Text>
        </View>

        <View style={styles.containerDivider}>
          <View style={styles.divider} />
        </View>

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
              Song name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, groupedBy === "album" && styles.activeChip]}
            onPress={() => setGroupedBy("album")}
          >
            <Text
              style={[
                styles.chipText,
                groupedBy === "album" && styles.activeChipText,
              ]}
            >
              Album
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={groupedSongs}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [groupName, songs] = item;
          const isExpanded = expandedGroups[groupName] || false;

          return (
            <View style={styles.groupBox}>
              <TouchableOpacity
                style={styles.groupHeader}
                onPress={() => toggleGroup(groupName)}
              >
                <Text style={styles.groupTitle}>{groupName}</Text>
                <MaterialIcons
                  name={isExpanded ? "expand-less" : "expand-more"}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              {isExpanded &&
                songs.map((song) => (
                  <TouchableOpacity
                    key={song.id}
                    onPress={() => {
                      setSelectedSong(song);
                      setModalVisible(true);
                    }}
                  >
                    <View style={styles.songItem}>
                      <Image
                        source={song.localImageSource}
                        style={styles.songImage}
                      />
                      <View style={styles.songName}>
                        <Text>{song.title}</Text>
                        <Text>{song.artist}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          );
        }}
      />
      {selectedSong && (
        <SongModal
          song={{
            title: selectedSong.title,
            artist: { name: selectedSong.artist },
            album: {
              title: selectedSong.album,
              cover_medium: selectedSong.albumCover,
            },
          }}
          visible={modalVisible}
          editMode={true}
          onSave={handleUpdateSong}
          onDelete={handleDeleteSong}
          onClose={() => setModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}
// --------------------- Styles ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
    paddingTop: 40,
  },
  appTitle: {
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
  doText: {
    color: "#b7adcf",
    fontStyle: "normal",
    fontVariant: ["small-caps"],
  },
  knowText: {
    color: "#09A9A9",
    fontStyle: "normal",
    fontVariant: ["small-caps"],
  },
  signText: {
    fontSize: 36,
    color: "#b7adcf",
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
    width: "90%",
  },
  sortingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#3C3C3E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: "#09A9A9",
  },
  chipText: {
    color: "#A9A9A9",
    fontSize: 14,
    fontWeight: "500",
  },
  activeChipText: {
    color: "#FFFFFF",
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
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
    color: "#b7adcf",
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
    borderRadius: 5,
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
