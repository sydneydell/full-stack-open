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

const Display = ({ query, filteredCountries, handleShow }) => {
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
              <button onClick={() => handleShow(country)}>Show</button>
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
  const [selectedCountry, setSelectedCountry] = useState(null);

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
    setSelectedCountry(null);
  }, [query, countries]);

  const handleQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <Filter query={query} handleQuery={handleQuery} />
      {selectedCountry ? (
        <CountryInfo country={selectedCountry} />
      ) : (
        <Display query={query} filteredCountries={filteredCountries} handleShow={handleShow} />
      )}    </div>
  );
};

export default App;
