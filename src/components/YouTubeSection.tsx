import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Youtube, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  view_count: number | null;
  like_count: number | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}
<!-- === YouTube Section Start === -->
<section id="youtube-section">
  <h2>Latest Videos</h2>
  <div id="youtube-videos" class="video-grid"></div>
</section>

<style>
  /* YouTube Section Styling */
  #youtube-section {
    padding: 20px;
    background: #f9f9f9;
  }
  #youtube-section h2 {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
  .video-card {
    text-decoration: none;
    color: inherit;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    transition: transform 0.2s ease;
  }
  .video-card:hover {
    transform: scale(1.03);
  }
  .video-card img {
    width: 100%;
    display: block;
  }
  .video-card h3 {
    font-size: 1rem;
    padding: 10px;
    line-height: 1.3;
  }
</style>

<script>
  // Replace with your deployed Supabase Edge Function URL
  const EDGE_FUNCTION_URL = "https://yvmqcqrewqvwroxinzvn.supabase.co/functions/v1/YouTube_rss";

  async function loadYouTubeVideos() {
    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();

      const container = document.getElementById("youtube-videos");
      container.innerHTML = "";

      (data.latest_videos || []).forEach(video => {
        const card = document.createElement("a");
        card.href = video.url;
        card.target = "_blank";
        card.className = "video-card";
     card.innerHTML = `
        img src="${video.thumbnail_url}" alt="${video.title}">
  <h3>${video.title}</h3>
  <p>${video.description || ''}</p>
  ${video.view_count ? `<div>Views: ${video.view_count}</div>` : ''}
`;
        container.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading videos:", err);
    }
  }

  // Load videos when the page is ready
  document.addEventListener("DOMContentLoaded", loadYouTubeVideos);
</script>
<!-- === YouTube Section End === -->
