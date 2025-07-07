async function scrapeCodeChef(username) {
    const url = `https://www.codechef.com/users/${username}`;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    };

    try {
        const response = await fetch(url, { headers });
        
        if (response.status !== 200) {
            console.log("❌ CodeChef profile not found.");
            return;
        }

        const html = await response.text();
        console.log(`\n👨‍🍳 CodeChef Profile: ${url}`);

        // DEBUG: Uncomment to inspect structure
        // console.log(html.substring(0, 2000));

        // Rating
        const ratingMatch = html.match(/<div[^>]*class="[^"]*rating-number[^"]*"[^>]*>([^<]*)<\/div>/i);
        if (ratingMatch) {
            const rating = ratingMatch[1].trim();
            console.log(`Rating: ${rating}`);
        } else {
            console.log("Rating: Not found");
        }

        // Stars
        const starsMatch = html.match(/<span[^>]*class="[^"]*rating[^"]*"[^>]*>([^<]*)<\/span>/i);
        if (starsMatch) {
            console.log(`Stars: ${starsMatch[1].trim()}`);
        } else {
            console.log("Stars: Not found");
        }

        // Highest rating (in <small>)
        const highestMatch = html.match(/<small[^>]*>([^<]*)<\/small>/i);
        if (highestMatch) {
            console.log(`Highest Rating: ${highestMatch[1].trim()}`);
        } else {
            console.log("Highest Rating: Not found");
        }

        // Try to find username/handle
        const handleMatch = html.match(/<h1[^>]*>([^<]*)<\/h1>/i) || 
                           html.match(/<span[^>]*class="[^"]*username[^"]*"[^>]*>([^<]*)<\/span>/i);
        if (handleMatch) {
            console.log(`Handle: ${handleMatch[1].trim()}`);
        }

        // Try to find contest participation
        const contestMatches = html.match(/contests?\s*participated[^>]*>([^<]*)</gi);
        if (contestMatches) {
            console.log("Contest Info:");
            contestMatches.forEach(match => {
                console.log(` - ${match.replace(/<[^>]*>/g, '').trim()}`);
            });
        }

        // Ranks - Look for various rank patterns
        const rankPatterns = [
            /<ul[^>]*class="[^"]*inline-list[^"]*"[^>]*>(.*?)<\/ul>/gi,
            /<li[^>]*>([^<]*rank[^<]*)<\/li>/gi,
            /<div[^>]*class="[^"]*rank[^"]*"[^>]*>([^<]*)<\/div>/gi
        ];

        let ranksFound = false;
        for (const pattern of rankPatterns) {
            let match;
            while ((match = pattern.exec(html)) !== null) {
                if (!ranksFound) {
                    console.log("Ranks:");
                    ranksFound = true;
                }
                
                // Extract text and clean it
                const rankText = match[1].replace(/<[^>]*>/g, '').trim();
                if (rankText && rankText.length > 0) {
                    console.log(` - ${rankText}`);
                }
            }
        }

        if (!ranksFound) {
            console.log("Ranks: Not found");
        }

        // Try to find additional profile information
        const profilePatterns = {
            'Country': /<span[^>]*class="[^"]*country[^"]*"[^>]*>([^<]*)<\/span>/i,
            'Institution': /<span[^>]*class="[^"]*institution[^"]*"[^>]*>([^<]*)<\/span>/i,
            'Solved Problems': /solved[^>]*>([^<]*)</i,
            'Attempted Problems': /attempted[^>]*>([^<]*)</i
        };

        console.log("\nAdditional Info:");
        for (const [key, pattern] of Object.entries(profilePatterns)) {
            const match = html.match(pattern);
            if (match && match[1].trim()) {
                console.log(` - ${key}: ${match[1].trim()}`);
            }
        }

        // Try to extract problem solving stats
        const statsPattern = /<div[^>]*class="[^"]*problem-stats[^"]*"[^>]*>(.*?)<\/div>/gi;
        const statsMatch = html.match(statsPattern);
        if (statsMatch) {
            console.log("\nProblem Stats:");
            statsMatch.forEach(stat => {
                const cleanStat = stat.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                if (cleanStat.length > 0) {
                    console.log(` - ${cleanStat}`);
                }
            });
        }

    } catch (error) {
        console.error('Error scraping CodeChef profile:', error.message);
    }
}

// ✅ Use your actual CodeChef username
const username = "optimal_solver";
scrapeCodeChef(username);