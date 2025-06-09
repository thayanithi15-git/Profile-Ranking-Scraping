import requests

def get_github_data(username):
    base_url = "https://api.github.com"
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }

    # 1. User Profile
    user_resp = requests.get(f"{base_url}/users/{username}", headers=headers)
    if user_resp.status_code != 200:
        print("User not found")
        return
    user = user_resp.json()
    print(f"Name: {user.get('name')}")
    print(f"Username: {user['login']}")
    print(f"Company: {user.get('company')}")
    print(f"Location: {user.get('location')}")
    print(f"Bio: {user.get('bio')}")
    print(f"Public Repos: {user['public_repos']}")
    print(f"Profile: {user['html_url']}")
    print()

    # 2. Repositories Info
    print("Repositories:")
    repos_resp = requests.get(f"{base_url}/users/{username}/repos?per_page=100", headers=headers)
    repos = repos_resp.json()

    for repo in repos:
        print(f"\nRepo: {repo['name']}")
        print(f"   URL: {repo['html_url']}")
        print(f"   Stars: {repo['stargazers_count']}, Forks: {repo['forks_count']}")
        print(f"   Language: {repo['language']}")
        print(f"   Updated At: {repo['updated_at']}")

        # Commit info
        commits_url = repo['commits_url'].replace('{/sha}', '')
        commits_resp = requests.get(commits_url, headers=headers)
        if commits_resp.status_code == 200:
            commits = commits_resp.json()
            print(f"   Commits (visible): {len(commits)}")
        else:
            print("   Commit data not accessible.")

    print("\nDone.")

# Run the function with your GitHub username
get_github_data("thayanithi15-git")
