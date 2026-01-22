import Tesseract from 'tesseract.js';

export async function extractMatchData(imageFile) {
    try {
        const result = await Tesseract.recognize(
            imageFile,
            'eng',
            { logger: m => console.log(m) }
        );

        const text = result.data.text;
        console.log('Extracted Text:', text);

        // TODO: Parse the text to extract specific fields
        // For now, just return the raw text or mock data based on text presence

        // Split into lines for easier processing
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        // 1. Parse Score and Teams
        // Sample: "Borussia Dortmund 4] = [2] iconics"
        let score = "0 - 0";
        let opponent = "Unknown Opponent";

        for (const line of lines) {
            // Regex for "Team Name Score = Score Team Name"
            // Handles "4] = [2]", "4 - 2", "4 : 2"
            const scoreMatch = line.match(/(.*?)\s*(\d+)\s*[\]|)]?\s*[=:-]\s*[\[|(]?\s*(\d+)\s*(.*)/);
            if (scoreMatch) {
                const team1 = scoreMatch[1].trim();
                const score1 = scoreMatch[2];
                const score2 = scoreMatch[3];
                const team2 = scoreMatch[4].trim();

                score = `${score1} - ${score2}`;
                // Heuristic: Assume user is Team 1, Opponent is Team 2. 
                // Or if Team 2 is very short/garbage (like "iconics" or "cy"), maybe check Team 1.
                // For now, let's grab Team 2 as opponent if it exists, otherwise just "Opponent"
                opponent = team2 || team1 || "Opponent";
                break; // Stop after finding score
            }
        }

        // 2. Parse Stats
        // Format: "42% Possession 58%" or "17 Shots 20"
        const findStat = (keywords) => {
            for (const line of lines) {
                // Check if any keyword matches
                if (keywords.some(k => line.toLowerCase().includes(k.toLowerCase()))) {
                    // Extract numbers. Typically [Number] [Text] [Number]
                    // Clean non-digits from ends but keep the middle text to identify separation? 
                    // Actually, getting all numbers in the line usually works for this layout
                    const numbers = line.match(/(\d+)/g);
                    if (numbers && numbers.length >= 2) {
                        // Usually First number is User, Last number is Opponent (or Middle if garbage exists)
                        // In "09 [158 Passes 20 |", numbers are 09, 158, 20. 
                        // The stat numbers are likely the ones closest to the center or just the logic:
                        // "158 Passes 20" -> 158, 20.

                        // Strict Regex: Number ... Keyword ... Number
                        const cleanLine = line.replace(/[^a-zA-Z0-9%\s]/g, ''); // Remove brackets, pipes etc

                        // Try to find the specific pattern: Number keyword Number
                        // "14 Shots on Target 9"
                        const pattern = new RegExp(`(\\d+).*?${keywords[0]}.*?(\\d+)`, 'i'); // Use first keyword as main anchor
                        const match = line.match(pattern);
                        if (match) {
                            return { user: parseInt(match[1]), opponent: parseInt(match[2]) };
                        }

                        // Fallback: take the largest two numbers if parsing failed? No, risky.
                        // Let's trust the regex match.
                    }
                }
            }
            return { user: 0, opponent: 0 };
        };

        const possession = findStat(['Possession']);
        const shotsOnTarget = findStat(['Shots on Target']);
        const passes = findStat(['Successful Passes', 'Passes']); // Prefer Successful Passes, fallback to Passes

        // Return structured data
        return {
            text,
            opponent: opponent,
            score: score,
            stats: {
                possession: possession,
                shots_on_target: shotsOnTarget,
                completed_passes: passes
            }
        };
    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
}
