import React from "react";
import "./YTstyles.css";
import YoutubeEmbed from "./YoutubeEmbed";

export default function YouTubeTest(prop) {
  return (
    <div className="App">
      {/* <h1>Youtube Embed</h1> */}
      <YoutubeEmbed embedId={prop.YTlink} />
    </div>
  );
}