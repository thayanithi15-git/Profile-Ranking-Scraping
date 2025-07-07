/**
 * LinkedIn Profile Data Scraper - Updated Implementation
 * Save as: linkedin-profile-scraper.js
 * Run with: node linkedin-profile-scraper.js
 */
require('dotenv').config();

class LinkedInProfileScraper {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-public-data';
    }

    async scrapeProfileData(linkedinUrl, options = {}) {
        try {
            console.log(`🔍 Scraping profile data for: ${linkedinUrl}`);
            
            const response = await this.makeRequest(linkedinUrl, options);
            const result = this.parseResponse(response);
            
            console.log('✅ Success!');
            return result;
        } catch (error) {
            console.error('❌ Error scraping LinkedIn profile data:', error.message);
            throw error;
        }
    }

    async makeRequest(linkedinUrl, options = {}) {
        // Build URL with query parameters
        const url = new URL(this.baseUrl);
        url.searchParams.append('linkedin_url', linkedinUrl);
        
        // Set default options (all false for minimal data)
        const defaultOptions = {
            include_skills: false,
            include_certifications: false,
            include_publications: false,
            include_honors: false,
            include_volunteers: false,
            include_projects: false,
            include_patents: false,
            include_courses: false,
            include_organizations: false,
            include_profile_status: false,
            include_company_public_url: false
        };

        // Merge with user options
        const finalOptions = { ...defaultOptions, ...options };

        // Add all options to URL
        Object.entries(finalOptions).forEach(([key, value]) => {
            url.searchParams.append(key, value.toString());
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.text();
    }

    // Alternative method using XMLHttpRequest (for browser)
    async makeRequestXHR(linkedinUrl, options = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function() {
                if (this.readyState === this.DONE) {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(this.responseText);
                    } else {
                        reject(new Error(`HTTP ${this.status}: ${this.statusText}`));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error occurred'));
            });

            // Build URL with query parameters
            const url = new URL(this.baseUrl);
            url.searchParams.append('linkedin_url', linkedinUrl);
            
            // Set default options
            const defaultOptions = {
                include_skills: false,
                include_certifications: false,
                include_publications: false,
                include_honors: false,
                include_volunteers: false,
                include_projects: false,
                include_patents: false,
                include_courses: false,
                include_organizations: false,
                include_profile_status: false,
                include_company_public_url: false
            };

            const finalOptions = { ...defaultOptions, ...options };

            // Add all options to URL
            Object.entries(finalOptions).forEach(([key, value]) => {
                url.searchParams.append(key, value.toString());
            });

            xhr.open('GET', url.toString());
            xhr.setRequestHeader('x-rapidapi-key', this.apiKey);
            xhr.setRequestHeader('x-rapidapi-host', 'fresh-linkedin-profile-data.p.rapidapi.com');

            xhr.send();
        });
    }

    parseResponse(responseText) {
        try {
            const data = JSON.parse(responseText);
            
            if (data.error) {
                throw new Error(data.error);
            }

            return {
                success: true,
                data: data,
                timestamp: new Date().toISOString(),
                profile_url: data.profile_url || 'N/A'
            };
        } catch (error) {
            if (error instanceof SyntaxError) {
                // If JSON parsing fails, return raw response
                return {
                    success: true,
                    data: responseText,
                    timestamp: new Date().toISOString(),
                    type: 'raw_response'
                };
            }
            throw error;
        }
    }

    isValidLinkedInProfileUrl(url) {
        // Updated regex to handle LinkedIn profile URLs
        const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?$/;
        return linkedinRegex.test(url);
    }

    // Helper method to create options for detailed scraping
    createDetailedOptions() {
        return {
            include_skills: true,
            include_certifications: true,
            include_publications: true,
            include_honors: true,
            include_volunteers: true,
            include_projects: true,
            include_patents: true,
            include_courses: true,
            include_organizations: true,
            include_profile_status: true,
            include_company_public_url: true
        };
    }
}

// Configuration - UPDATE THESE VALUES
const CONFIG = {
    apiKey: process.env.LINKEDIN_API_KEY, // Your API key
    urls: [
        'https://www.linkedin.com/in/navani-hk/',
        // 'https://www.linkedin.com/in/cjfollini/',
        // Add more profile URLs here
    ],
    // Scraping options
    basicScraping: {
        include_skills: false,
        include_certifications: false,
        include_publications: false,
        include_honors: false,
        include_volunteers: false,
        include_projects: false,
        include_patents: false,
        include_courses: false,
        include_organizations: false,
        include_profile_status: false,
        include_company_public_url: false
    },
    detailedScraping: {
        include_skills: true,
        include_certifications: true,
        include_publications: true,
        include_honors: true,
        include_volunteers: true,
        include_projects: true,
        include_patents: true,
        include_courses: true,
        include_organizations: true,
        include_profile_status: true,
        include_company_public_url: true
    }
};

// Main execution function
async function main() {
    console.log('🚀 LinkedIn Profile Data Scraper Started');
    console.log('==========================================');
    
    const scraper = new LinkedInProfileScraper(CONFIG.apiKey);
    const results = [];
    
    for (let i = 0; i < CONFIG.urls.length; i++) {
        const url = CONFIG.urls[i];
        
        try {
            console.log(`\n📋 Processing ${i + 1}/${CONFIG.urls.length}`);
            
            // Validate URL
            if (!scraper.isValidLinkedInProfileUrl(url)) {
                console.log(`⚠️  Invalid LinkedIn profile URL: ${url}`);
                continue;
            }
            
            // Use basic scraping by default (can be changed to CONFIG.detailedScraping)
            const result = await scraper.scrapeProfileData(url, CONFIG.basicScraping);
            results.push(result);
            
            console.log('📊 Profile Preview:');
            if (result.data && typeof result.data === 'object') {
                // Show key profile fields
                const preview = {
                    name: result.data.name || result.data.full_name || 'N/A',
                    headline: result.data.headline || 'N/A',
                    location: result.data.location || 'N/A',
                    connections: result.data.connections || result.data.connection_count || 'N/A',
                    summary: result.data.summary ? result.data.summary.substring(0, 100) + '...' : 'N/A',
                    current_position: result.data.current_position || 'N/A'
                };
                console.log(JSON.stringify(preview, null, 2));
            } else {
                // Show first 200 characters if it's raw text
                const preview = typeof result.data === 'string' 
                    ? result.data.substring(0, 200) + '...' 
                    : result.data;
                console.log(preview);
            }
            
            console.log('==========================================');
            
            // Add delay between requests to avoid rate limiting
            if (i < CONFIG.urls.length - 1) {
                console.log('⏳ Waiting 3 seconds before next request...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
        } catch (error) {
            console.error(`❌ Failed to scrape ${url}:`, error.message);
            console.log('==========================================');
        }
    }
    
    // Save results to file
    await saveResults(results);
    
    console.log(`\n🏁 Scraping completed! Processed ${results.length} URLs successfully.`);
}

// Save results to JSON file
async function saveResults(results) {
    try {
        const fs = require('fs').promises;
        const filename = `linkedin_profiles_${new Date().toISOString().split('T')[0]}.json`;
        
        await fs.writeFile(filename, JSON.stringify(results, null, 2));
        console.log(`💾 Results saved to: ${filename}`);
    } catch (error) {
        console.error('❌ Failed to save results:', error.message);
    }
}

// Interactive mode function
async function interactiveMode() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
    
    console.log('🎯 Interactive LinkedIn Profile Scraper Mode');
    console.log('=============================================');
    
    try {
        const apiKey = await question('Enter your RapidAPI key (press Enter for default): ');
        const useDefaultKey = !apiKey.trim();
        
        const linkedinUrl = await question('Enter LinkedIn profile URL: ');
        
        const scrapingMode = await question('Choose scraping mode (1=Basic, 2=Detailed): ');
        const useDetailedScraping = scrapingMode.trim() === '2';
        
        const scraper = new LinkedInProfileScraper(useDefaultKey ? CONFIG.apiKey : apiKey);
        const options = useDetailedScraping ? CONFIG.detailedScraping : CONFIG.basicScraping;
        
        const result = await scraper.scrapeProfileData(linkedinUrl, options);
        
        console.log('✅ Success!');
        console.log('📊 Complete Profile Data:');
        console.log(JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

// Test single URL function
async function testSingleUrl(url, detailed = false) {
    console.log(`🧪 Testing single URL: ${url}`);
    console.log(`📋 Mode: ${detailed ? 'Detailed' : 'Basic'} scraping`);
    console.log('==========================================');
    
    const scraper = new LinkedInProfileScraper(CONFIG.apiKey);
    const options = detailed ? CONFIG.detailedScraping : CONFIG.basicScraping;
    
    try {
        const result = await scraper.scrapeProfileData(url, options);
        console.log('✅ Success!');
        console.log('📊 Complete Profile Data:');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Command line argument handling
const args = process.argv.slice(2);

if (args.includes('--interactive') || args.includes('-i')) {
    interactiveMode();
} else if (args.includes('--test') || args.includes('-t')) {
    const testUrl = args[args.indexOf('--test') + 1] || args[args.indexOf('-t') + 1] || CONFIG.urls[0];
    const detailed = args.includes('--detailed') || args.includes('-d');
    testSingleUrl(testUrl, detailed);
} else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
LinkedIn Profile Data Scraper

Usage:
  node linkedin-profile-scraper.js                    # Run with predefined URLs (basic mode)
  node linkedin-profile-scraper.js --interactive      # Interactive mode
  node linkedin-profile-scraper.js --test [URL]       # Test single URL (basic mode)
  node linkedin-profile-scraper.js --test [URL] -d    # Test single URL (detailed mode)
  node linkedin-profile-scraper.js --help             # Show this help

Configuration:
  Edit the CONFIG object in the file to set:
  - Your RapidAPI key
  - List of LinkedIn profile URLs to scrape
  - Scraping options (basic vs detailed)

Scraping Modes:
  Basic: Only core profile information
  Detailed: Includes skills, certifications, publications, etc.

Examples:
  node linkedin-profile-scraper.js
  node linkedin-profile-scraper.js -i
  node linkedin-profile-scraper.js --test "https://www.linkedin.com/in/cjfollini/"
  node linkedin-profile-scraper.js --test "https://www.linkedin.com/in/cjfollini/" --detailed
    `);
} else {
    main();
}

// Export for use as module
module.exports = LinkedInProfileScraper;