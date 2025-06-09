import requests

def get_youtube_channel_data(api_key, username):
    # Step 1: Get channel ID using the handle
    handle_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q={username}&key={api_key}"
    handle_resp = requests.get(handle_url).json()

    if not handle_resp['items']:
        print("Channel not found.")
        return

    channel_id = handle_resp['items'][0]['snippet']['channelId']

    # Step 2: Fetch channel details
    channel_url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id={channel_id}&key={api_key}"
    channel_resp = requests.get(channel_url).json()
    channel = channel_resp['items'][0]

    snippet = channel['snippet']
    stats = channel['statistics']

    print(f"Channel Title     : {snippet['title']}")
    print(f"Description       : {snippet['description']}")
    print(f"Published At      : {snippet['publishedAt']}")
    print(f"Custom URL        : {snippet.get('customUrl', 'N/A')}")
    print(f"Country           : {snippet.get('country', 'N/A')}")
    print(f"Subscribers       : {stats.get('subscriberCount', 'Hidden')}")
    print(f"Total Views       : {stats.get('viewCount')}")
    print(f"Total Videos      : {stats.get('videoCount')}")
    print(f"Profile Image URL : {snippet['thumbnails']['high']['url']}")

# Replace this with your API key and YouTube handle
API_KEY = "AIzaSyDacFby5IWt2Wu-I7Us64Gdqve57VlUCH4"
get_youtube_channel_data(API_KEY, "thayanithi2006")
