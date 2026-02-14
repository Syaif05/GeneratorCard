import { faker } from '@faker-js/faker'
import { supabase } from './supabase'

const getRandom = (arr) => {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

const unmaskNumber = (str) => {
    if (!str) return faker.finance.creditCardNumber('#### #### #### ####');
    let clean = str.replace(/[xX*]/g, () => Math.floor(Math.random() * 10).toString());
    return clean.replace(/-/g, ' '); // Ganti strip dengan spasi
}

// Fungsi Generate Password (Nama + 4 Random Char)
const generatePassword = (fullName) => {
    const firstName = fullName.split(' ')[0]; // Ambil nama depan saja
    const chars = "0123456789!@#$%^&*?"; // Pool angka dan simbol
    
    // Hitung sisa karakter yang dibutuhkan agar total minimal 12
    // Minimal tetap tambah 4 karakter acak meski nama sudah panjang
    const needed = Math.max(4, 12 - firstName.length);
    
    let suffix = "";
    for (let i = 0; i < needed; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return firstName + suffix;
}

export async function fetchSourceData() {
  const { data, error } = await supabase
    .from('identity_names')
    .select('category, val_data')
  
  if (error) throw error

  const pool = { email: [], card: [], name_gender: [] }

  data.forEach(item => {
    // Legacy pool keys (names from admin page might use specific categories)
    // admin page: name_gender, email, card
    // DB categories: name_gender, email, card
    if (!pool[item.category]) pool[item.category] = []
    pool[item.category].push(item.val_data)
  })

  return pool
}

export function generateBatch(count, pool, options = { nameLength: 2 }) {
  const results = []

  for (let i = 0; i < count; i++) {
    // 1. NAME
    const rawNameGender = getRandom(pool.name_gender)
    let firstName = "Unknown", gender = "U"

    if (rawNameGender && rawNameGender.includes('$')) {
        const split = rawNameGender.split('$')
        firstName = split[0]; gender = split[1]
    } else if (rawNameGender) {
        firstName = rawNameGender
    } else {
        const sex = faker.person.sexType()
        firstName = faker.person.firstName(sex)
        gender = sex === 'female' ? 'F' : 'M'
    }

    let fullName = firstName
    const targetLength = parseInt(options.nameLength)
    if (targetLength >= 2) fullName += ` ${faker.person.lastName()}`
    if (targetLength >= 3) fullName += ` ${faker.person.lastName()}`

    // 2. EMAIL
    const rawEmail = getRandom(pool.email)
    let email = ""
    if (rawEmail && !rawEmail.includes('@')) {
       const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '')
       email = `${cleanName}${faker.number.int(99)}@${rawEmail}`
    } else {
       email = rawEmail || faker.internet.email({ firstName })
    }

    // 3. CARD
    const rawCard = getRandom(pool.card)
    let cardData = {
        number: faker.finance.creditCardNumber('#### #### #### ####'), 
        exp: faker.date.future().toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
        cvv: faker.finance.creditCardCVV()
    }

    if (rawCard && rawCard.includes('|')) {
        const parts = rawCard.split('|')
        if (parts.length >= 1) cardData.number = unmaskNumber(parts[0])
        if (parts.length >= 3) {
             const yearShort = parts[2].length === 4 ? parts[2].slice(-2) : parts[2]
             cardData.exp = `${parts[1]}/${yearShort}`
        }
        if (parts.length >= 4) cardData.cvv = parts[3]
    } else if (rawCard) {
        cardData.number = unmaskNumber(rawCard)
    }

    // 4. PASSWORD (NEW LOGIC)
    const password = generatePassword(fullName);

    results.push({
      id: faker.string.uuid(),
      name: fullName,
      gender,
      email,
      password, // Masukkan ke data result
      ...cardData
    })
  }

  return results
}