/**
 * Generates Gmail aliases using the "dot trick".
 * 
 * @param {string} email - The input email (e.g., "username@gmail.com")
 * @returns {string[]} - Array of generated aliases
 */
export const generateGmailDotTrick = (email) => {
    if (!email || !email.includes('@')) return [];
    
    // Normalize and Split
    const [username, domain] = email.toLowerCase().split('@');
    
    // Clean username (just in case user entered dots initially)
    const cleanUsername = username.replace(/\./g, '');
    const len = cleanUsername.length;
    
    // Limit length to avoid browser crash (2^15 = 32k, 2^16 = 65k, 2^18 = 262k)
    // 15 chars is safe limit for instant client side generation (~16k combos)
    const MAX_LEN = 15; 
    
    if (len > MAX_LEN) {
        throw new Error(`Username too long. Max ${MAX_LEN} characters allowed for generator.`);
    }

    const combinations = [];
    const totalCombinations = 1 << (len - 1); // 2^(len-1)

    // Using bitwise method to determine dot placement
    for (let i = 0; i < totalCombinations; i++) {
        let newName = "";
        
        for (let j = 0; j < len; j++) {
            newName += cleanUsername[j];
            
            // Check if we should insert a dot after this character
            // We check the j-th bit of i
            // We don't put a dot after the last character
            if (j < len - 1 && ((i >> j) & 1)) {
                newName += ".";
            }
        }
        
        combinations.push(`${newName}@${domain}`);
    }

    return combinations;
}

/**
 * Downloads content as a text file
 */
export const downloadTxt = (content, filename = 'emails.txt') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
