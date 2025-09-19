import CountryDetails from './CountryDetails'

const CountryList = (props) => {
  if (!props.searchTerm) {
    return <div></div>
  }
  const filteredCountries = props.countries.filter(country =>
    country.name.common.toLowerCase().includes(props.searchTerm.toLowerCase())
  )
  if (filteredCountries.length > 10) {
    return <div>Too many countries, specify another filter</div>
  }
  if (filteredCountries.length === 1) {
    return <CountryDetails countryName={filteredCountries[0].name.common} />
  }
  return (
    <div>
      {filteredCountries.map(country => 
        <div>
          <p key={country.name.common}>{country.name.common} <button onClick={() => props.showDetails(country.name.common)}>show</button></p>
        </div>
      )}
    </div>
  )
}

export default CountryList