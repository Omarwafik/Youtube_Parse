import React from 'react'
import Video from './Video'

export default function VideoGridLayout({videos, loading }) {
  // console.log(videos)
  return (
  <div className="videos-grid">
  {videos.map((video) => (
    <Video
    loading={loading}
      key={video.id || video.snippet?.resourceId?.videoId}
      video={video}
    />
  ))}
</div>

  )
}
