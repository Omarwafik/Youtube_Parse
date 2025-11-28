import axios from "axios";

const YT_BASE = "https://www.googleapis.com/youtube/v3";
export const API_KEY = import.meta.env.VITE_YT_API_KEY;


// Get channel ID from a URL with @handle
export const getChannelIdFromHandle = async (url, API_KEY) => {
  try {
    // Extract Channel Name from URL
    const handle = url.split("@")[1];
    if (!handle) throw new Error("Invalid handle URL");

    // Extract Channel ID =>  data.items[0].id
    const apiUrl = `${YT_BASE}/channels?part=id&forHandle=${handle}&key=${API_KEY}`;
    const res = await axios.get(apiUrl);
    const data = res.data;
    // console.log(data)
    if (!data.items || data.items.length === 0) {
      throw new Error("Channel not found");
    }
    return data.items[0].id; 
  } catch (err) {
    console.error("getChannelIdFromHandle error:", err);
    return null;
  }
};

// Get the uploads playlist ID of a channel
export const getUploadsPlaylistId = async (channelId, API_KEY) => {
  try {
    const apiUrl = `${YT_BASE}/channels?part=contentDetails,snippet,statistics&id=${channelId}&key=${API_KEY}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.items || data.items.length === 0) return null;

    // Return the uploads playlist ID
    return data.items[0].contentDetails.relatedPlaylists.uploads;
  } catch (err) {
    console.error("getUploadsPlaylistId error:", err);
    return null;
  }
};

// Get videos from a playlist (max 20 per request, supports pagination)
export const getVideosFromPlaylist = async (playlistId, API_KEY, pageToken = "") => {
  try {
    const apiUrl = `${YT_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=20&pageToken=${pageToken}&key=${API_KEY}`;
    const res = await axios.get(apiUrl);
    const data = res.data;
    console.log(data)
    // data.items -> list of videos
    // data.nextPageToken -> for pagination
    return data;
  } catch (err) {
    console.error("getVideosFromPlaylist error:", err);
    return null;
  }
};

// Get video details (contentDetails, statistics) for a list of video IDs
// ===== to get duration and view count ======
export const getVideoDetails = async (videoIds, API_KEY) => {
  try {
    const apiUrl = `${YT_BASE}/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`;
    const res = await axios.get(apiUrl);
    return res.data.items;
  } catch (err) {
    console.error("getVideoDetails error:", err);
    return [];
  }
};


