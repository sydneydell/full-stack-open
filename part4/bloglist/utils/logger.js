// Two functions: 
//      info for print normal log messages
//      error for all error messages

const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') { 
      console.log(...params)
    }
}
  
const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') { 
      console.error(...params)
    }

}
module.exports = {
    info, error
}