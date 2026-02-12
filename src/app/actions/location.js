'use server'

import { Country, State, City } from 'country-state-city'

export async function getCountries() {
  try {
    return Country.getAllCountries().map(c => ({
      code: c.isoCode,
      name: c.name,
      flag: c.flag,
      phonecode: c.phonecode
    }))
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  }
}

export async function getStates(countryCode) {
  try {
    if (!countryCode) return []
    return State.getStatesOfCountry(countryCode).map(s => ({
      code: s.isoCode,
      name: s.name
    }))
  } catch (error) {
    console.error("Error fetching states:", error)
    return []
  }
}

export async function getCities(countryCode, stateCode) {
  try {
    if (!countryCode) return []
    // If stateCode is provided, get cities of state. 
    // If not (some small countries don't have states), get cities of country directly if supported or return empty.
    if (stateCode) {
        return City.getCitiesOfState(countryCode, stateCode).map(c => ({
            name: c.name,
            lat: c.latitude,
            lng: c.longitude
        }))
    } else {
        return City.getCitiesOfCountry(countryCode).map(c => ({
            name: c.name,
            lat: c.latitude,
            lng: c.longitude
        }))
    }
  } catch (error) {
    console.error("Error fetching cities:", error)
    return []
  }
}
