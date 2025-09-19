import { useState, useEffect } from 'react'
import SearchInput from './components/SearchInput'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

function App() {
  const [countries, setCountries] = useState([]) 
  const [searchTerm, setSearchTerm] = useState('')
  const [currentCountry, setCurrentCountry] = useState('')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setCurrentCountry('')
  }

  const showDetails = (country) => {
    setCurrentCountry(country)
  }
  
  useEffect(() => {
    fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => res.json())
      .then((json) => setCountries(json))
      .catch((err) => console.error("Failed to fetch JSON:", err))
  }, [])

  return (
    <div>
      <SearchInput handleSearch={handleSearch}/>
      <CountryList countries={countries} searchTerm={searchTerm} showDetails={showDetails}/>
      <CountryDetails countryName={currentCountry}/>
    </div>
  )
}

export default App
