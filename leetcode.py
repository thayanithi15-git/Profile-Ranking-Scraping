import requests

def get_leetcode_profile(username):
    url = "https://leetcode.com/graphql"

    query = """
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          school
          countryName
          ranking
          userAvatar
          aboutMe
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
    """

    variables = {"username": username}
    response = requests.post(url, json={"query": query, "variables": variables})
    
    if response.status_code == 200:
        data = response.json()["data"]["matchedUser"]
        if data:
            profile = data["profile"]
            stats = data["submitStats"]["acSubmissionNum"]
            print(f"Username: {data['username']}")
            print(f"Name: {profile.get('realName')}")
            print(f"School: {profile.get('school')}")
            print(f"Country: {profile.get('countryName')}")
            print(f"Ranking: {profile.get('ranking')}")
            print(f"About: {profile.get('aboutMe')}")
            print("\nProblem Stats:")
            for item in stats:
                print(f"  - {item['difficulty']}: {item['count']} solved, {item['submissions']} submissions")
        else:
            print("User not found or profile is private.")
    else:
        print("Failed to fetch data. Status Code:", response.status_code)

# Use correct LeetCode username
get_leetcode_profile("thayanithi15")
