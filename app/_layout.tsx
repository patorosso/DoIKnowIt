import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { SongsProvider } from "@/context/SongContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SeedData } from "@/constants/Seed";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS songs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          artist TEXT,
          genre TEXT,
          albumCover TEXT
        );
      `);

      const result = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM songs"
      );
      if (result && result.count === 0) {
        await db.runAsync(SeedData);
      }
    });
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SongsProvider>
        <SQLiteProvider databaseName="songs.db" onInit={migrateDbIfNeeded}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SQLiteProvider>
      </SongsProvider>
    </ThemeProvider>
  );
}
