import { useState } from "react";
import {
  API_KEY,
  getChannelIdFromHandle,
  getUploadsPlaylistId,
  getVideoDetails,
  getVideosFromPlaylist,
} from "./api";
import "./App.css";
import Inputs from "./Inputs";
import VideoGridLayout from "./VideoGridLayout";
import Pagination from "./Pagination";
import Loading from "./Loading";

function App() {
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideosData = async (url) => {
    setLoading(true);
    // 1. Get Channel ID from URL
    const channelId = await getChannelIdFromHandle(url, API_KEY);
    if (!channelId) return;

    // 2. Get uploads playlist ID from channel ID
    const uploadsPlaylistId = await getUploadsPlaylistId(channelId, API_KEY);
    if (!uploadsPlaylistId) return;

    setPlaylistId(uploadsPlaylistId);

    const videosData = await getVideosFromPlaylist(uploadsPlaylistId, API_KEY);
    // setVideos(videosData.items);
    // console.log(videosData)
    setNextPageToken(videosData.nextPageToken || null);
    setPrevPageToken(videosData.prevPageToken || null);

    const videoIds = videosData.items.map((video) => video.snippet.resourceId.videoId);
    const videoDetails = await getVideoDetails(videoIds, API_KEY);
    // console.log(videoDetails)
    const mergedVideos = videosData.items.map((item) => {
      const details = videoDetails.find(
        (vid) => vid.id === item.snippet.resourceId.videoId
      );
      return { ...item, details };
    });
    // console.log(mergedVideos)
    setVideos(mergedVideos);
    setLoading(false);
  };

  const handleNextPage = async () => {
    setLoading(true);
    const data = await getVideosFromPlaylist(playlistId, API_KEY, nextPageToken);

    // Get the video IDs from playlist items
    const videoIds = data.items.map(item => item.contentDetails.videoId).join(',');

    // Fetch full video details for these IDs
    const detailsData = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    ).then(res => res.json());

    // Merge the details into playlist items
    const itemsWithDetails = data.items.map(item => {
      const details = detailsData.items.find(d => d.id === item.contentDetails.videoId);
      return { ...item, details };
    });

    setVideos(itemsWithDetails);
    setNextPageToken(data.nextPageToken || null);
    setPrevPageToken(data.prevPageToken || null);
    setLoading(false);
  };

  const handlePrevPage = async () => {
      setLoading(true);
    const data = await getVideosFromPlaylist(playlistId, API_KEY, prevPageToken);

    // Get the video IDs from playlist items
    const videoIds = data.items.map(item => item.contentDetails.videoId).join(',');

    // Fetch full video details for these IDs
    const detailsData = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    ).then(res => res.json());

    // Merge the details into playlist items
    const itemsWithDetails = data.items.map(item => {
      const details = detailsData.items.find(d => d.id === item.contentDetails.videoId);
      return { ...item, details };
    });

    setVideos(itemsWithDetails);
    setPrevPageToken(data.prevPageToken || null);
    setNextPageToken(data.nextPageToken || null);
    setLoading(false);
  };

//  if (loading) {
//     return <Loading />;
//   }

  return (
    <div>
      <Inputs onSubmit={fetchVideosData} />
      <hr />
      <VideoGridLayout videos={videos} loading={loading} />
      <Pagination
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        showPrev={!!prevPageToken}
        showNext={!!nextPageToken}
      />
    </div>
  );
}
export default App;
