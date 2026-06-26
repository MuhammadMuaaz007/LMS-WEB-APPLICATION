"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoUrl) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    axios
      .post("http://localhost:8000/api/v1/getVdoCipherOTP", {
        videoId: videoUrl,
      })
      .then((res) => {
        setVideoData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Video auth token generation failed:", err);
        setLoading(false);
      });
  }, [videoUrl]);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner relative flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 dark:bg-black/40 z-20">
          <div className="w-8 h-8 border-2 border-[#37a39a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {videoData.otp && videoData.playbackInfo ? (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=2popTvG27ReoqLzy`}
          className="absolute top-0 left-0 w-full h-full border-0 z-10"
          allowFullScreen={true}
          allow="encrypted-media"
        />
      ) : !loading ? (
        <p className="text-xs font-Poppins text-slate-400 dark:text-gray-500 font-medium">
          No active video stream source found
        </p>
      ) : null}
    </div>
  );
};

export default CoursePlayer;