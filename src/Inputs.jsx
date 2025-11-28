import React, { useState } from 'react'

export default function Inputs({onSubmit}) {
    const [url, setUrl] = useState("");

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleClick = () => {
    if (!url) return alert("Please enter a YouTube URL");
    onSubmit(url); 
  };
  return (
    <div>
      <span></span>
      <input className='input-url' type="text" placeholder="URL Ex:https://www.youtube.com/@user" onChange={handleChange} />
      <button onClick={handleClick}>Fetch Videos</button>
    </div>

  )
}
