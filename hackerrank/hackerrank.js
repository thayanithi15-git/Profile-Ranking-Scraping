async function scrapeHackerrank(username) {
    const url = `https://www.hackerrank.com/profile/${username}`;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    };

    try {
        const response = await fetch(url, { headers });

        if (response.status !== 200) {
            console.log("❌ HackerRank profile not found.");
            return;
        }

        const html = await response.text();
        
        console.log(`\n👤 HackerRank Profile: ${url}`);
        
        // Extract title using regex (since we don't have BeautifulSoup)
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : "No name found";
        console.log(`Title: ${title.trim()}`);

        // Try to find badges using regex patterns
        const badgePatterns = [
            /<[^>]*class="[^"]*badge-title[^"]*"[^>]*>([^<]*)<\/[^>]*>/gi,
            /<[^>]*class="[^"]*badge-name[^"]*"[^>]*>([^<]*)<\/[^>]*>/gi
        ];

        let badges = [];
        
        for (const pattern of badgePatterns) {
            let match;
            while ((match = pattern.exec(html)) !== null) {
                const badgeText = match[1].trim();
                if (badgeText && !badges.includes(badgeText)) {
                    badges.push(badgeText);
                }
            }
        }

        console.log("Badges:");
        if (badges.length > 0) {
            badges.slice(0, 5).forEach(badge => {
                console.log(` - ${badge}`);
            });
        } else {
            console.log(" - No badges found or profile data is private");
        }

        // Try to extract other profile information
        const profilePatterns = {
            rank: /<[^>]*class="[^"]*rank[^"]*"[^>]*>([^<]*)<\/[^>]*>/gi,
            score: /<[^>]*class="[^"]*score[^"]*"[^>]*>([^<]*)<\/[^>]*>/gi,
            country: /<[^>]*class="[^"]*country[^"]*"[^>]*>([^<]*)<\/[^>]*>/gi
        };

        console.log("\nAdditional Info:");
        for (const [key, pattern] of Object.entries(profilePatterns)) {
            const match = pattern.exec(html);
            if (match && match[1].trim()) {
                console.log(` - ${key.charAt(0).toUpperCase() + key.slice(1)}: ${match[1].trim()}`);
            }
        }

    } catch (error) {
        console.error('Error scraping HackerRank profile:', error.message);
    }
}

// Use your actual HackerRank username here
const username = "devaup05";
scrapeHackerrank(username);