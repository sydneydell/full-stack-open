/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import countryService from './services/countries.js'

const Filter = ({ query, handleQuery }) => (
  <div>
    find countries <input value={query} onChange={handleQuery} />
  </div>
);

const CountryInfo = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area} km²</p>
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map(language => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img
      src={country.flags.png}
      alt={`Flag of ${country.name.common}`}
      width="200"
    />
  </div>
)

const Display = ({ query, filteredCountries }) => {
  if (filteredCountries.length > 0) {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    } else if (filteredCountries.length === 1) {
      return <CountryInfo country={filteredCountries[0]}/>
    } else {
      return (
        <div>
          {filteredCountries.map(country => (
            <div key={country.cca3}>
              {country.name.common}
            </div>
          ))}
        </div>
      );  
    }
  } else if (query) {
    return <p>No matches found</p>;
  } else {
    return null;
  }
};

const App = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  // Fetch all countries only once when the component mounts
  useEffect(() => {
    countryService
      .getAllCountries()
      .then(data => setCountries(data))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  // Filter countries based on the partial query
  useEffect(() => {
    if (query) {
      setFilteredCountries(
        countries.filter(country =>
          country.name.common.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredCountries([]); // Clear list if query is empty
    }
  }, [query, countries]);

  const handleQuery = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <Filter query={query} handleQuery={handleQuery} />
      <Display query={query} filteredCountries={filteredCountries} />
    </div>
  );
};

export default App;
