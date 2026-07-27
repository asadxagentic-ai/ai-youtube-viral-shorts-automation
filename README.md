## Overview
This n8n workflow automates the creation of viral YouTube Shorts from a source YouTube video. It handles video download, AI-powered clip selection, rendering with optional captions, cloud storage, metadata generation, and publishing to YouTube Shorts and Instagram Reels via Make.com. Results are logged to Google Sheets.

## How It Works
1. **Webhook Trigger** – Receives a POST request with YouTube URL, number of clips (1‑10), aspect ratio (9:16 or 1:1), and caption toggle.
2. **Validation** – Validates URL format, aspect ratio, and clip count; generates an execution ID.
3. **Source Video Download** – Uses SocialKit API to fetch a 720p MP4 stream URL, downloads the file, uploads to Google Drive, and makes it publicly accessible.
4. **AI Clip Selection** – Sends video title and duration to Qwen (Alibaba Cloud) to identify the most engaging 20‑60 second segments.
5. **Shotstack Rendering** – Builds a Shotstack timeline for each clip (video + optional caption overlay) and submits render jobs.
6. **Polling** – Polls Shotstack every 15 seconds (max 20 attempts) until each render completes.
7. **Clip Storage** – Downloads rendered clips, uploads to Google Drive.
8. **Metadata Generation** – Uses Qwen again to create catchy hook titles, descriptions, and hashtags for each clip.
9. **Publishing via Make.com** – Sends enriched clip data (Drive links, metadata) to a Make.com webhook for publishing to YouTube Shorts and Instagram Reels.
10. **Result Logging** – Parses Make.com response for published URLs, logs each clip’s details (title, hook, links, status, processing time) to Google Sheets.
11. **Webhook Response** – Returns success with execution ID or error details to the caller.

## Nodes & Tools Used
| Node / Service | Purpose |
|----------------|---------|
| n8n Webhook | Entry point for automation requests |
| n8n Code (multiple) | Data validation, transformation, polling logic |
| SocialKit API | YouTube video download (720p MP4) |
| Google Drive | Store source video and rendered clips |
| Qwen (Alibaba DashScope) | AI clip selection & metadata generation |
| Shotstack API | Cloud video rendering with captions |
| Make.com (webhook) | Publish clips to YouTube Shorts & Instagram Reels |
| Google Sheets | Log results (clip number, title, hook, links, status, time) |
| n8n HTTP Request | All external API calls |
| n8n Wait | Polling delay (15s) |
| n8n IF | Render completion check |
| n8n Respond to Webhook | Return success/failure to caller |

## Prerequisites
- **n8n instance** (self‑hosted or cloud) with ability to install custom nodes (none required beyond base).
- **API credentials** for:
  - SocialKit (x‑access‑key)
  - Qwen / Alibaba Cloud DashScope (Authorization token)
  - Shotstack (x‑api‑key)
  - Make.com (webhook URL)
  - Google Sheets OAuth2
  - Google Drive OAuth2
- **Google Drive folders** for “Yt Automation” (rendered clips) and “Raw Video Clips” (source videos).
- **Google Sheet** with columns: Clips Number, Yt Video Title, Hook Title, Ig Reel Link, Youtube Short Link, Status, Timespent.

## Setup & Usage
1. **Import Workflow** – In n8n, import the workflow JSON file.
2. **Configure Credentials** – Replace all placeholder credentials (marked `YOUR_*_HERE` or `REPLACE_WITH_YOUR_*`) with actual credential IDs/names in n8n.
3. **Set Google Drive Folder IDs** – Update the `folderId` values in the *Upload Source to Drive* and *Upload Clips to Google Drive* nodes to your target folders.
4. **Set Google Sheet ID** – Update the `documentId` in both *Log Aborted to Sheet* and *Log Completed to Sheet* nodes.
5. **Activate Workflow** – Enable the workflow; the webhook endpoint will be `https://<your‑n8n‑domain>/webhook/yt-automation`.
6. **Test** – Send a POST request to the webhook with JSON body:
   
   {
     "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
     "numberOfClips": 3,
     "aspectRatio": "9:16",
     "applyCaptions": "yes"
   }
   
   The workflow responds immediately with an execution ID; processing continues asynchronously.
7. **Monitor** – Check Google Sheet for logged results; check Google Drive for uploaded clips.

## Use Cases
- **Content Creators** – Repurpose long‑form YouTube videos into multiple Shorts/Reels automatically.
- **Social Media Agencies** – Scale short‑form video production for clients with minimal manual effort.
- **Marketing Teams** – Quickly generate viral‑candidate clips for campaigns, with AI‑optimized hooks and hashtags.
- **Developers** – Extend the workflow (e.g., add TikTok publishing, different AI models, or custom branding).