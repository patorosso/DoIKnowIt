import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
      <Image
        source={require("@/assets/images/app_icon_dark.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text>
        <Text style={styles.infoSubtitle}>Pato currently knows </Text>
        <Text style={styles.infoCount}>{songCount}</Text>
        <Text style={styles.infoSubtitle}> songs!</Text>
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
    marginTop: 110,
  },
  icon: {
    width: 180,
    height: 180,
  },
  infoText: {
    color: "#b7adcf",
    fontSize: 20,
    marginBottom: 8,
  },
  infoSubtitle: {
    color: "#b7adcf",
    fontSize: 15,
  },
  infoCount: {
    color: "#09A9A9",
    fontSize: 15,
  },
});
