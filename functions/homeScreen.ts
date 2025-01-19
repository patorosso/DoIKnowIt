import { Song } from "@/constants/Types";
import * as FileSystem from "expo-file-system";

export const groupSongs = (
  category: "artist" | "album" | "title",
  songs: Song[]
): [string, Song[]][] => {
  const grouped = songs.reduce((acc: Record<string, Song[]>, song: Song) => {
    let key = song[category];
    if (category === "title") {
      const firstChar = song.title[0].toUpperCase();
      key = /[A-Z]/.test(firstChar) ? firstChar : "#";
    }
    if (!acc[key]) acc[key] = [];
    acc[key].push(song);
    return acc;
  }, {});
  return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
};

export const getImageSource = async (
  albumCover: string
): Promise<{ uri: string } | any> => {
  if (!albumCover) {
    return require("@/assets/images/react-logo.png");
  }

  const filePath = `${FileSystem.documentDirectory}${albumCover}`;
  const fileInfo = await FileSystem.getInfoAsync(filePath);

  if (fileInfo.exists) {
    return { uri: filePath };
  }

  return require("@/assets/images/react-logo.png");
};

export const handleTitleTextLengthStyle = (title: string): any => {
  if (title.length > 50) {
    return {
      color: "#FFFFFF",
      fontSize: 8,
      fontWeight: "bold",
    };
  }
  if (title.length > 30) {
    return {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "bold",
    };
  }
  return {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  };
};
