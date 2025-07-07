require('dotenv').config();

async function getYouTubeChannelData(apiKey, username) {
    try {
        // Step 1: Get channel ID using the handle
        const handleUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${apiKey}`;
        const handleResp = await fetch(handleUrl);
        const handleData = await handleResp.json();

        if (!handleData.items || handleData.items.length === 0) {
            console.log("Channel not found.");
            return;
        }

        const channelId = handleData.items[0].snippet.channelId;

        // Step 2: Fetch channel details
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
        const channelResp = await fetch(channelUrl);
        const channelData = await channelResp.json();
        
        if (!channelData.items || channelData.items.length === 0) {
            console.log("Channel details not found.");
            return;
        }

        const channel = channelData.items[0];
        const snippet = channel.snippet;
        const stats = channel.statistics;

        console.log(`Channel Title     : ${snippet.title}`);
        console.log(`Description       : ${snippet.description}`);
        console.log(`Published At      : ${snippet.publishedAt}`);
        console.log(`Custom URL        : ${snippet.customUrl || 'N/A'}`);
        console.log(`Country           : ${snippet.country || 'N/A'}`);
        console.log(`Subscribers       : ${stats.subscriberCount || 'Hidden'}`);
        console.log(`Total Views       : ${stats.viewCount || 'N/A'}`);
        console.log(`Total Videos      : ${stats.videoCount || 'N/A'}`);
        console.log(`Profile Image URL : ${snippet.thumbnails.high.url}`);

    } catch (error) {
        console.error('Error fetching YouTube channel data:', error);
    }
}

const API_KEY = process.env.YOUTUBE_API_KEY;

getYouTubeChannelData(API_KEY, "thayanithi2006");