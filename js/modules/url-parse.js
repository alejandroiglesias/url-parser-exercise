import _ from 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js'

/**
 * Parses URL according to the format provided and returns object with params.
 *
 * @param  {String} format Format of the URL to be parsed. Parts are delimited by `/` and variable parts prefixed with `:` (ie, /nonvariable/:variable/). Querystring params are also parsed.
 * @param  {String} url URL path to be parsed
 * @return {object}
 */
export default function urlParse(format, url) {
  const partRegex = /\/([A-Za-z0-9:]+)/gi
  const querystringRegex = /([A-Za-z0-9:]+=[A-Za-z0-9:]+)/gi

  // -- Parse part params --
  const formatParts = format.match(partRegex)
  const urlParts = url.match(partRegex)

  // Basic sanity check
  if (_.isEmpty(format) || _.isEmpty(formatParts)) throw TypeError('Invalid format string.')
  if (_.isEmpty(url) || _.isEmpty(urlParts)) throw TypeError('Invalid URL string.')

  // For the matched parts, run reduce to get the variable parts only
  const partParams = urlParts.reduce((result, value, i) => {
    const varPartKey = formatParts[i].split(':')

    // If part is split, it is variable, so take the key/value and set into object
    if (varPartKey.length > 1) {
      const key = varPartKey[1]
      value = value.replace('/', '')

      // Parse part value in case it contains a number
      result[key] = parseParamValue(value)
    }
    return result
  }, {})

  // -- Parse querystring params --
  // Chain operations on data with Lodash to get key/vals as object
  const querystringParams = _.chain(url.match(querystringRegex))
    .map((param) => {
      const keyValPair = param.split('=')
      keyValPair[1] = parseParamValue(keyValPair[1])
      return keyValPair
    })
    .fromPairs()
    .value()

  return _.extend(partParams, querystringParams)
}

/**
 * Parses value into int number unless result is NaN (ie, parsing a non int string), in which case it returns the original value.
 *
 * @param {String} value The string value to be parsed to int number.
 * @return {Number|String}
 */
function parseParamValue(value) {
  return _.defaultTo(_.parseInt(value), value)
}
