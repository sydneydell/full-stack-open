import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// since we're retrieving the notes from the server, there's no need to pass data as props to the App component
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// get method returns a promise
// must use promise.then to access the result of a promise

// axios.get('http://localhost:3001/notes').then(response => {
//   const notes = response.data
//   ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
// })