import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

const AddInfoText = () => {
  const db = useSQLiteContext();
  const [songCount, setSongCount] = useState(0);

  useEffect(() => {
    const fetchSongCount = async () => {
      try {
        const result = await db.getFirstAsync<{ count: number }>(
          "SELECT COUNT(*) as count FROM songs"
        );
        setSongCount(result!.count);
      } catch (error) {
        console.error("Error fetching song count:", error);
      }
    };

    fetchSongCount();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.infoSubtitle}>
        Pato currently knows {songCount} songs!
      </Text>
    </View>
  );
};

export default AddInfoText;

// --------------------- Styles ----------------------

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 200,
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 8,
  },
  infoSubtitle: {
    color: "#A9A9A9",
    fontSize: 19,
  },
});
