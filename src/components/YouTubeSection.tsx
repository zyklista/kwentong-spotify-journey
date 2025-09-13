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
  #youtube-section {
    padding: 20px;
    background: #f9f9f9;
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
    display: flex;
    flex-direction: column;
  }
  .video-card:hover {
    transform: scale(1.03);
  }
  .video-card img {
    width: 100%;
    display: block;
  }
  .video-info {
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .video-title {
    font-size: 1rem;
    font-weight: bold;
    margin: 0 0 8px 0;
  }
  .video-desc {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 8px;
  }
  .video-views {
    font-size: 0.85rem;
    color: #888;
    margin-top: auto;
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

      // Show only the latest 5 videos (or less if not enough)
      (data.latest_videos || []).slice(0, 5).forEach(video => {
        const card = document.createElement("a");
        card.href = video.url;
        card.target = "_blank";
        card.className = "video-card";
        card.innerHTML = `
          <img src="${video.thumbnail_url}" alt="${video.title}">
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-desc">${video.description || ""}</div>
            ${video.view_count ? `<div class="video-views">Views: ${video.view_count.toLocaleString()}</div>` : ""}
          </div>
        `;
        container.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading videos:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", loadYouTubeVideos);
</script>
<!-- === YouTube Section End === -->
