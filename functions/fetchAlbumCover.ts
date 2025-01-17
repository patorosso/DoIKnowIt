import axios from "axios";

export const fetchAlbumCover = async (
  artist: string,
  title: string
): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(
        artist
      )}&t=${encodeURIComponent(title)}`
    );

    const track = response.data?.track?.[0];
    return track?.strAlbumThumb || null;
  } catch (error) {
    console.error("Error fetching album cover:", error);
    return null;
  }
};
