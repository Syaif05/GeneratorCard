import { 
    faker, 
    fakerID_ID, 
    fakerEN_US, 
    fakerJA, 
    fakerKO,
    fakerZH_CN,
    fakerDE,
    fakerFR,
    fakerES,
    fakerIT,
    fakerRU,
    fakerPT_BR
} from '@faker-js/faker'

// Map ISO Country Codes to Faker Instances
const localeMap = {
    'ID': fakerID_ID,  // Indonesia
    'US': fakerEN_US,  // USA
    'JP': fakerJA,     // Japan
    'KR': fakerKO,     // Korea
    'CN': fakerZH_CN,  // China
    'DE': fakerDE,     // Germany
    'FR': fakerFR,     // France
    'ES': fakerES,     // Spain
    'IT': fakerIT,     // Italy
    'RU': fakerRU,     // Russia
    'BR': fakerPT_BR,  // Brazil
    // Add more as needed, fallback to US/EN
}

export const getFaker = (countryCode) => {
    return localeMap[countryCode] || fakerEN_US
}

export const getPhoneFormat = (countryCode) => {
    // Custom phone formatting if Faker is too generic
    switch(countryCode) {
        case 'ID': return '+62 8##-####-####';
        case 'US': return '+1 (###) ###-####';
        default: return null; // Use faker default
    }
}
