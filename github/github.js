async function getGitHubData(username) {
    const baseUrl = "https://api.github.com";
    const headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    };

    try {
        // 1. User Profile
        const userResp = await fetch(`${baseUrl}/users/${username}`, { headers });
        if (userResp.status !== 200) {
            console.log("User not found");
            return;
        }
        
        const user = await userResp.json();
        console.log(`Name: ${user.name || 'N/A'}`);
        console.log(`Username: ${user.login}`);
        console.log(`Company: ${user.company || 'N/A'}`);
        console.log(`Location: ${user.location || 'N/A'}`);
        console.log(`Bio: ${user.bio || 'N/A'}`);
        console.log(`Public Repos: ${user.public_repos}`);
        console.log(`Followers: ${user.followers}`);
        console.log(`Following: ${user.following}`);
        console.log(`Profile: ${user.html_url}`);
        console.log(`Created At: ${user.created_at}`);
        console.log();

        // 2. Repositories Info
        console.log("Repositories:");
        const reposResp = await fetch(`${baseUrl}/users/${username}/repos?per_page=100&sort=updated`, { headers });
        
        if (reposResp.status !== 200) {
            console.log("Could not fetch repositories");
            return;
        }
        
        const repos = await reposResp.json();

        for (const repo of repos) {
            console.log(`\nRepo: ${repo.name}`);
            console.log(`   URL: ${repo.html_url}`);
            console.log(`   Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}`);
            console.log(`   Language: ${repo.language || 'N/A'}`);
            console.log(`   Description: ${repo.description || 'No description'}`);
            console.log(`   Updated At: ${repo.updated_at}`);
            console.log(`   Created At: ${repo.created_at}`);
            console.log(`   Size: ${repo.size} KB`);
            console.log(`   Default Branch: ${repo.default_branch}`);

            // Commit info
            const commitsUrl = repo.commits_url.replace('{/sha}', '');
            try {
                const commitsResp = await fetch(commitsUrl, { headers });
                if (commitsResp.status === 200) {
                    const commits = await commitsResp.json();
                    console.log(`   Recent Commits (visible): ${commits.length}`);
                    
                    // Show latest commit info
                    if (commits.length > 0) {
                        const latestCommit = commits[0];
                        console.log(`   Latest Commit: ${latestCommit.commit.message.split('\n')[0]}`);
                        console.log(`   Commit Author: ${latestCommit.commit.author.name}`);
                        console.log(`   Commit Date: ${latestCommit.commit.author.date}`);
                    }
                } else {
                    console.log("   Commit data not accessible.");
                }
            } catch (commitError) {
                console.log("   Could not fetch commit data.");
            }

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`\nTotal repositories: ${repos.length}`);
        console.log("Done.");

    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
    }
}

// Helper function to add delay between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the function with your GitHub username
const username = "user";
getGitHubData(username);