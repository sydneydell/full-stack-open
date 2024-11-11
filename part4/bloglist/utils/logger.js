// Two functions: 
//      info for print normal log messages
//      error for all error messages

const info = (...params) => {
    console.log(...params)
}

const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}