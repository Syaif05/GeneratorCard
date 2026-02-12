export const generateCreditCard = (bin, count = 10, month = 'Random', year = 'Random', cvv = '') => {
  const generated = []

  // Ensure BIN is at least 6 digits, if not, pad or alert (but here we just return empty or error string)
  if (!bin || bin.length < 6) return []

  for (let i = 0; i < count; i++) {
    // 1. Generate PAN with Luhn
    const pan = generateLuhn(bin)
    
    // 2. Generate Exp Date
    let expMonth = month
    if (month === 'Random' || !month) {
        // Random 1-12
        expMonth = Math.floor(Math.random() * 12) + 1
        expMonth = expMonth.toString().padStart(2, '0')
    } else {
        expMonth = expMonth.toString().padStart(2, '0')
    }

    let expYear = year
    if (year === 'Random' || !year) {
        // Random 2026 - 2035
        const currentYear = new Date().getFullYear()
        expYear = Math.floor(Math.random() * 10) + currentYear
    }

    // 3. Generate CVV
    let cardCvv = cvv
    if (!cvv) {
        // 3 digits usually (Amex 4, but let's stick to standard for now or detect based on BIN if refined)
        cardCvv = Math.floor(Math.random() * 900) + 100 // 100-999
    }

    // Format: PAN|MM|YYYY|CVV
    generated.push(`${pan}|${expMonth}|${expYear}|${cardCvv}`)
  }

  return generated
}

// Luhn Algorithm Generator
const generateLuhn = (bin) => {
  let pan = bin.toString()
  // Target length 16 usually. Amex 15. Let's assume 16 for standard generator unless BIN detection says otherwise.
  // MadLeets template request shows 16 digits output.
  const targetLength = 16
  
  // Fill with random digits until length - 1
  while (pan.length < targetLength - 1) {
    pan += Math.floor(Math.random() * 10)
  }

  // Calculate Check Digit
  const digits = pan.split('').map(Number)
  let sum = 0
  let isSecond = true // We typically iterate from right to left for verification, but for generation we calculate the LAST digit.
  // Standard luhn: double every second digit from the right.
  // Since we are finding the LAST digit (which is at index 15, i.e., Odd 16th position), 
  // we count backwards from the last existing digit (index 14).
  
  // Let's use the standard "Calculate Check Digit" formula
  // Reverse digits to make it 1-based index from right (skipping the check digit place)
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i]
    if (isSecond) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    isSecond = !isSecond
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return pan + checkDigit
}
