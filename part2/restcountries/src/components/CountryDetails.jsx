import { useState, useEffect } from 'react'

const CountryDetails = ({ countryName }) => {
  if (!countryName) return <div></div>

  const [country, setCountry] = useState(null)
  const [countryWeather, setCountryWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    if (!countryName) return

    const fetchData = async () => {
      try {
        const countryRes = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
        const countryData = await countryRes.json()
        setCountry(countryData)

        const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${countryData.capital}&limit=1&appid=${apiKey}`)
        const geoData = await geoRes.json()
        const capitalGeo = geoData[0]

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${capitalGeo.lat}&lon=${capitalGeo.lon}&appid=${apiKey}&units=metric`)
        const weatherData = await weatherRes.json()
        setCountryWeather(weatherData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      }
    }

    fetchData()
  }, [countryName, apiKey])

  if (!country) return <div></div>

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png}/>
      <h3>Weather in {country.capital}</h3>
      <p>Temperature: {countryWeather?.main?.temp}</p>
      <img src={`https://openweathermap.org/img/wn/${countryWeather?.weather[0].icon}@2x.png`}/>
      <p>Wind speed: {countryWeather?.wind?.speed} m/s</p>
    </div>
  )
}

export default CountryDetails
