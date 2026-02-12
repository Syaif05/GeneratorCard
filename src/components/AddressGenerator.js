'use client'

import { useState, useEffect } from 'react'
import { getCountries, getStates, getCities } from '../app/actions/location'
import { Copy, RefreshCw, MapPin, Check, User, Calendar, Shield } from 'lucide-react'
import { faker } from '@faker-js/faker'
import Tooltip from './Tooltip'
import { supabase } from '../lib/supabase'

import SearchableSelect from './SearchableSelect'

export default function AddressGenerator() {
  // Location States
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  // Selection States
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  // Loading States
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Generated Data
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(null)

  // Load Countries on Mount
  useEffect(() => {
    getCountries().then(data => {
      setCountries(data)
      setInitializing(false)
    })
  }, [])

  // Handle Country Change (Adapting to SearchableSelect's onChange(value))
  const handleCountryChange = async (value) => {
    setSelectedCountry(value)
    setSelectedState('')
    setSelectedCity('')
    setStates([])
    setCities([])
    
    if (value) {
      const fetchedStates = await getStates(value)
      setStates(fetchedStates)
    }
  }

  // Handle State Change
  const handleStateChange = async (value) => {
    setSelectedState(value)
    setSelectedCity('')
    setCities([])

    if (selectedCountry && value) {
      const fetchedCities = await getCities(selectedCountry, value)
      setCities(fetchedCities)
    }
  }

  // Generate Address Logic
  const generateAddress = async () => {
    setLoading(true)
    try {
      // 1. Get Base Location Data
      const countryData = countries.find(c => c.code === selectedCountry)
      const stateData = states.find(s => s.code === selectedState)
      let cityData = cities.find(c => c.name === selectedCity)

      // Intelligent City Fallback
      if (selectedState && !selectedCity && cities.length > 0) {
          cityData = cities[Math.floor(Math.random() * cities.length)]
      }
      
      // 2. Setup Localized Faker
      const { getFaker, getPhoneFormat } = await import('../lib/faker-locales')
      const localFaker = getFaker(selectedCountry)

      // 3. Generate Personal Data
      let firstName = localFaker.person.firstName()
      let lastName = localFaker.person.lastName()
      let gender = localFaker.person.sexType()
      let fullName = `${firstName} ${lastName}`

      // Try to fetch real name from DB if possible
      const { data: nameData } = await supabase
        .from('source_data')
        .select('value')
        .eq('category', 'name_gender')
        .limit(20)
      
      if (nameData && nameData.length > 0) {
         const randomItem = nameData[Math.floor(Math.random() * nameData.length)].value
         if (randomItem.includes('$')) {
            const [n, g] = randomItem.split('$')
            fullName = n
            gender = g === 'M' ? 'male' : 'female'
         }
      }

      // 4. Generate Address Details (Localized)
      const street = localFaker.location.streetAddress()
      const zipCode = localFaker.location.zipCode()
      
      const customPhoneFormat = getPhoneFormat(selectedCountry)
      let phoneNumber = customPhoneFormat 
          ? localFaker.helpers.replaceSymbols(customPhoneFormat)
          : localFaker.phone.number()
      
      if (!phoneNumber.startsWith('+') && countryData?.phonecode) {
         phoneNumber = `+${countryData.phonecode} ${phoneNumber}`
      }

      const birthday = localFaker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0]
      const ssn = localFaker.string.numeric(9) 

      let lat = cityData?.lat 
      let lng = cityData?.lng 
      
      if (!lat || !lng) {
         lat = localFaker.location.latitude()
         lng = localFaker.location.longitude()
      } else {
         lat = (parseFloat(lat) + (Math.random() - 0.5) * 0.02).toFixed(6)
         lng = (parseFloat(lng) + (Math.random() - 0.5) * 0.02).toFixed(6)
      }

      setData({
        street,
        city: cityData?.name || localFaker.location.city(),
        state: stateData?.name || localFaker.location.state(),
        zipCode,
        country: countryData?.name || 'Unknown',
        phone: phoneNumber,
        lat,
        lng,
        fullName,
        gender,
        birthday,
        ssn
      })

    } catch (error) {
      console.error("Generation Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }

  const DataItem = ({ label, value, fieldKey, icon: Icon }) => (
    <div 
        onClick={() => handleCopy(value, fieldKey)}
        className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-green-50/50 active:bg-green-100 transition-all cursor-pointer group select-none relative overflow-hidden"
    >
        <div className="flex items-center gap-3 relative z-10 w-full">
             {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />}
             <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{label}</div>
                <div className="text-slate-800 font-medium text-sm sm:text-base truncate group-hover:text-green-900 transition-colors pr-8">
                    {value}
                </div>
             </div>
        </div>

        {/* Copy Indicator */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 transform
             ${copied === fieldKey ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-2 scale-75'}`
        }>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded shadow-sm">
                <Check className="w-3 h-3" />
                Copied
            </span>
        </div>
        
        {/* Hover Hint (Only when not copied) */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 transform
             ${copied !== fieldKey ? 'group-hover:opacity-100 group-hover:translate-x-0' : 'opacity-0'} opacity-0 translate-x-2`
        }>
             <Copy className="w-4 h-4 text-slate-300" />
        </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto w-full">
      
      {/* Controls Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 relative z-20">
         <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Location Settings
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Country</label>
                <SearchableSelect 
                    options={countries}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Search Country..."
                    disabled={initializing}
                    iconProp="flag"
                />
            </div>

            {/* State */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">State / Province</label>
                <SearchableSelect 
                    options={states}
                    value={selectedState}
                    onChange={handleStateChange}
                    placeholder={states.length === 0 ? 'No States / Auto' : 'Search State...'}
                    disabled={!selectedCountry || states.length === 0}
                    labelProp="name"
                    valueProp="code"
                    iconProp={null}
                />
            </div>

            {/* City */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">City</label>
                <SearchableSelect 
                    options={cities}
                    value={selectedCity}
                    onChange={(val) => setSelectedCity(val)}
                    placeholder="Search City (Optional)..."
                    disabled={!selectedState && states.length > 0}
                    labelProp="name"
                    valueProp="name" // Accessing by name for city
                    iconProp={null}
                />
            </div>
         </div>

         <button 
            onClick={generateAddress}
            disabled={!selectedCountry || loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
         >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Generate New Identity'}
         </button>
      </div>

      {/* Results Section */}
      {data && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slide-up relative z-10">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="text-white font-bold flex items-center gap-2">
                     <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></span>
                     Generated Identity
                  </h3>
                  <span className="text-xs text-slate-400 italic">Click any row to copy</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                 {/* Left Column: Address */}
                 <div className="p-2">
                    <div className="px-3 py-2 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50/50 mb-2 rounded border border-blue-100">
                        Location Details
                    </div>
                    <DataItem label="Street" value={data.street} fieldKey="street" icon={MapPin} />
                    <DataItem label="City/Town" value={data.city} fieldKey="city" />
                    <DataItem label="State/Province" value={data.state} fieldKey="state" />
                    <DataItem label="Zip/Postal Code" value={data.zipCode} fieldKey="zipCode" />
                    <DataItem label="Country" value={data.country} fieldKey="country" />
                    <div className="grid grid-cols-2 gap-0">
                         <DataItem label="Latitude" value={data.lat} fieldKey="lat" />
                         <DataItem label="Longitude" value={data.lng} fieldKey="lng" />
                    </div>
                 </div>

                 {/* Right Column: Personal */}
                 <div className="p-2">
                    <div className="px-3 py-2 text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50/50 mb-2 rounded border border-purple-100">
                        Personal Profile
                    </div>
                    <DataItem label="Full Name" value={data.fullName} fieldKey="fullName" icon={User} />
                    <DataItem label="Gender" value={data.gender} fieldKey="gender" />
                    <DataItem label="Birthday" value={data.birthday} fieldKey="birthday" icon={Calendar} />
                    <DataItem label="SSN (Social Security)" value={data.ssn} fieldKey="ssn" icon={Shield} />
                    <DataItem label="Phone Number" value={data.phone} fieldKey="phone" />
                 </div>
              </div>
          </div>
      )}

      {/* Empty State */}
      {!data && !loading && (
        <div className="text-center py-12 opacity-50">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">Select a location and click Generate to start</p>
        </div>
      )}

    </div>
  )
}
