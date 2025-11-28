import React from "react";
import Loading from "./Loading";

export default function Video({ video , loading }) {
  console.log(video);
  // Helper functions
  // Format ISO 8601 duration to HH:MM:SS
  function formatDuration(duration) {
    const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    const h = hours > 0 ? `${hours}:` : "";
    const m = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
    const s = String(seconds).padStart(2, "0");

    return `${h}${m}:${s}`;
  }

  // Format view count to a readable string (e.g., 1.2K, 3.4M)
  function formatViews(views) {
    const num = Number(views);

    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }

    return num.toString();
  }

  // Calculate time ago from published date
  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    const minutes = diff / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    const years = days / 365;

    if (diff < 60) return "just now";
    if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    if (days < 30) return `${Math.floor(days)} days ago`;
    if (months < 12) return `${Math.floor(months)} months ago`;
    return `${Math.floor(years)} years ago`;
  }
  
  if(loading) {
    return (
      <Loading/>
    );
  }
  return (
    <div className="video">
      <div className="video-thumbnail">
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className=""
        />
        <p className="video-description">
          {" "}
          {video.details?.contentDetails?.duration
            ? formatDuration(video.details.contentDetails.duration)
            : ""}
        </p>
      </div>
      <div className="video-details">
        <h3 className="video-title">{video.snippet.title}</h3>
        {/* <h4 className="video-channel">{video.snippet.channelTitle}</h4> */}
        <div className="video-numbers">
          <p className="video-views">
            {video?.details?.statistics?.viewCount
              ? formatViews(video.details.statistics.viewCount)
              : ""}{" "}
            views
          </p>
          <span className="dot"></span>
          <p>
            {video.snippet.publishedAt
              ? timeAgo(video.snippet.publishedAt)
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
