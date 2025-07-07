async function getLeetCodeProfile(username) {
    const url = "https://leetcode.com/graphql";

    const query = `
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
    `;

    const variables = { username: username };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            const data = responseData.data.matchedUser;
            
            if (data) {
                const profile = data.profile;
                const stats = data.submitStats.acSubmissionNum;
                
                console.log(`Username: ${data.username}`);
                console.log(`Name: ${profile.realName || 'N/A'}`);
                console.log(`School: ${profile.school || 'N/A'}`);
                console.log(`Country: ${profile.countryName || 'N/A'}`);
                console.log(`Ranking: ${profile.ranking || 'N/A'}`);
                console.log(`About: ${profile.aboutMe || 'N/A'}`);
                console.log(`Avatar: ${profile.userAvatar || 'N/A'}`);
                console.log("\nProblem Stats:");
                
                stats.forEach(item => {
                    console.log(`  - ${item.difficulty}: ${item.count} solved, ${item.submissions} submissions`);
                });
            } else {
                console.log("User not found or profile is private.");
            }
        } else {
            console.log("Failed to fetch data. Status Code:", response.status);
        }
    } catch (error) {
        console.error('Error fetching LeetCode profile:', error.message);
    }
}

// Replace with the actual LeetCode username you want to query
const username = "your_username_here";
getLeetCodeProfile(username);