var _ = require('lodash')
var cs = require('world-countries')

var PROP_TYPE_ARRAY = 'array',
  PROP_TYPE_CURRENCY_MAP = 'currency',
  PROP_TYPE_MAP = 'map',
  PROP_TYPE_DEEP_STRING = 'deep_string',
  PROP_TYPE_IDD = 'idd',
  PROP_TYPE_LANG_KEYED_NAME = 'lang_keyed_name',
  PROP_TYPE_STRING = 'string'

var propTypes = {
  tld: PROP_TYPE_ARRAY,
  currencies: PROP_TYPE_CURRENCY_MAP,
  altSpellings: PROP_TYPE_ARRAY,
  latlng: PROP_TYPE_ARRAY,
  borders: PROP_TYPE_ARRAY,
  idd: PROP_TYPE_IDD,
  'name.common': PROP_TYPE_DEEP_STRING,
  'name.official': PROP_TYPE_DEEP_STRING,
  'name.native': PROP_TYPE_LANG_KEYED_NAME,
  translations: PROP_TYPE_LANG_KEYED_NAME,
  languages: PROP_TYPE_MAP,
  cca2: PROP_TYPE_STRING,
  ccn3: PROP_TYPE_STRING,
  cca3: PROP_TYPE_STRING,
  cioc: PROP_TYPE_STRING,
  capital: PROP_TYPE_ARRAY,
  region: PROP_TYPE_STRING,
  subregion: PROP_TYPE_STRING,
  demonyms: PROP_TYPE_LANG_KEYED_NAME,
  landlocked: PROP_TYPE_STRING,
  area: PROP_TYPE_STRING,
}

var CountryQuery = {
  /**
   * Find country information by some property.
   * @param  {string} by    Name of the property to search by.
   * @param  {string | number}  value The value to search for (case insensitive).
   * @param  {boolean} exact search exactly same or part
   * @return {null | Country | Country[]}        null, a country object or array of coutnry objects.
   */
  find: function (by, value, exact = true) {
    var propType = typeof by === 'string' ? propTypes[by] : 'unknown'

    switch (propType) {
      case PROP_TYPE_ARRAY:
        return findByArrayProp(by, value, exact)

      case PROP_TYPE_CURRENCY_MAP:
        return findByCurrencyInternal(value)

      case PROP_TYPE_DEEP_STRING:
        return findByDeepStringProp(by, value, exact)

      case PROP_TYPE_IDD:
        return findByIddInternal(value)

      case PROP_TYPE_LANG_KEYED_NAME:
        return findByLangKeyedName(by, value, exact)

      case PROP_TYPE_MAP:
        return findByMapProp(by, value)

      case PROP_TYPE_STRING:
        return findByStringProp(by, value)
    }
    return null
  },

  /**
   * Find country by its area.
   * @param  {number} area
   * @return {null | Country | Country[]} See #find()
   */
  findByArea: function (area) {
    return this.find('area', area)
  },

  /**
   * Find country by alternative spellings of its name.
   * @param  {string} altSpelling
   * @param  {boolean} exact search exactly same or part
   * @return {null | Country | Country[]} See #find()
   */
  findByAltSpelling: function (altSpelling, exact = true) {
    return this.find('altSpellings', altSpelling, exact)
  },

  /**
   * Find country by countries that it borders
   * @param  {string} borders
   * @return {null | Country | Country[]} See #find()
   */
  findByBorders: function (borders) {
    return this.find('borders', borders)
  },

  /**
   * Find country by its capital city.
   * @param  {string} capital
   * @return {null | Country | Country[]} See #find()
   */
  findByCapital: function (capital) {
    return this.find('capital', capital)
  },

  /**
   * Find country by 2-letter country code.
   * @param  {string} cca2
   * @return {null | Country | Country[]} See #find()
   */
  findByCca2: function (cca2) {
    return this.find('cca2', cca2)
  },

  /**
   * Find country by 3-letter country code.
   * @param  {string} cca3
   * @return {null | Country | Country[]} See #find()
   */
  findByCca3: function (cca3) {
    return this.find('cca3', cca3)
  },

  /**
   * Find country by 3-letter International Olympic Commitee country code.
   * @param  {string} cioc
   * @return {null | Country | Country[]} See #find()
   */
  findByCioc: function (cioc) {
    return this.find('cioc', cioc)
  },

  /**
   * Find country by numeric country code.
   * @param  {string} ccn3
   * @return {null | Country | Country[]} See #find()
   */
  findByCcn3: function (ccn3) {
    return this.find('ccn3', ccn3)
  },

  /**
   * Find country by currency.
   * @param  {string} currency
   * @return {null | Country | Country[]} See #find()
   */
  findByCurrency: function (currency) {
    return this.find('currencies', currency)
  },

  /**
   * Find country by one of the demonyms used for its citizens.
   * @param  {string} demonym
   * @return {null | Country | Country[]} See #find()
   */
  findByDemonym: function (demonym) {
    return this.find('demonyms', demonym)
  },

  /**
   * Find country by telephone IDD
   * @param  {string} idd
   * @return {null | Country | Country[]} See #find()
   */
  findByIdd: function (idd) {
    return this.find('idd', idd)
  },

  /**
   * Find country by whether or not it is landlocked.
   * @param  {boolean} landlocked
   * @return {null | Country | Country[]} See #find()
   */
  findByLandlocked: function (landlocked) {
    return this.find('landlocked', landlocked)
  },

  /**
   * Find country by its language.
   * @param  {string} language
   * @return {null | Country | Country[]} See #find()
   */
  findByLanguage: function (language) {
    return this.find('languages', language)
  },

  /**
   * Find country by its common name.
   * @param  {string} name
   * @param  {boolean} exact search exactly same or part
   * @return {null | Country | Country[]} See #find()
   */
  findByNameCommon: function (name, exact = true) {
    return this.find('name.common', name, exact)
  },

  /**
   * Find country by its native name
   * @param  {string} name
   * @param  {boolean} exact search exactly same or part
   * @return {null | Country | Country[]} See #find()
   */
  findByNameNative: function (name, exact = true) {
    return this.find('name.native', name, exact)
  },

  /**
   * Find country by its official name.
   * @param  {string} name
   * @param  {boolean} exact search exactly same or part
   * @return {null | Country | Country[]} See #find()
   */
  findByNameOfficial: function (name, exact = true) {
    return this.find('name.official', name, exact)
  },

  /**
   * Find country by the region it is located in.
   * @param  {string} region
   * @return {null | Country | Country[]} See #find()
   */
  findByRegion: function (region) {
    return this.find('region', region)
  },

  /**
   * Find country by subregion it is located in.
   * @param  {string} subregion
   * @return {null | Country | Country[]} See #find()
   */
  findBySubregion: function (subregion) {
    return this.find('subregion', subregion)
  },

  /**
   * Find country by top level domain.
   * @param  {string} tld
   * @return {null | Country | Country[]} See #find()
   */
  findByTld: function (tld) {
    return this.find('tld', tld)
  },

  /**
   * Find country by translations of its name.
   * @param  {string} translation
   * @param  {boolean} exact search exactly same or part
   * @return {null | Country | Country[]} See #find()
   */
  findByTranslation: function (translation, exact = true) {
    return this.find('translations', translation, exact)
  },
}

/**
 * Searches properties that contain array values.
 * @param  {string} prop  Name of the prop to search by
 * @param  {string | number} value Value to find
 * @param  {boolean} exact search exactly same or part
 * @return {null | Country | Country[]}        See filteredToResult
 */
function findByArrayProp(prop, value, exact = true) {
  var searchVal = lowerCaseIfNeeded(value)
  var filtered = _.filter(cs, function (c) {
    var propArray = _.map(c[prop], lowerCaseIfNeeded)

    if (exact) return _.includes(propArray, searchVal)

    var exist =
      _.filter(propArray, function (p) {
        return p.includes(searchVal)
      }).length !== 0
    return exist
  })

  return filteredToResult(filtered)
}

/**
 * Searches the 'currencies' property.
 * @param {string | number} value Value to find
 * @returns {null | Country | Country[]}     See filteredToResult
 */
function findByCurrencyInternal(value) {
  var searchVal = lowerCaseIfNeeded(value)
  var filtered = _.filter(cs, function (c) {
    if (c.currencies[upperCaseIfNeeded(value)]) {
      return true
    }

    return _(c.currencies)
      .values()
      .some(function (v) {
        return lowerCaseIfNeeded(v) === searchVal
      })
  })

  return filteredToResult(filtered)
}

/**
 * Searches properties that contain strings but are nested inside another
 * property (e.g. 'name.common').
 * @param  {string} propPath A property path
 * @param  {string} value    Value to find
 * @param  {boolean} exact search exactly same or part
 * @return {null | Country | Country[]}           See filteredToResult
 */
function findByDeepStringProp(propPath, value, exact) {
  var searchVal = lowerCaseIfNeeded(value)
  var filtered = _.filter(cs, function (v) {
    if (exact) return lowerCaseIfNeeded(_.get(v, propPath)) === searchVal
    return lowerCaseIfNeeded(_.get(v, propPath))?.includes(searchVal)
  })

  return filteredToResult(filtered)
}

/**
 * Searches the 'idd' property.
 * @param {string | number} value Value to find
 * @returns {null | Country | Country[]}      See filteredToResult
 */
function findByIddInternal(value) {
  var searchVal = typeof value !== 'string' ? value.toString() : value
  if (!searchVal.startsWith('+')) {
    searchVal = '+' + searchVal
  }
  // "idd": { "root": "+2", "suffixes": [ "90", "47" ] }
  var filtered = _.filter(cs, function (c) {
    for (var i = 0; i < c.idd.suffixes.length; i++) {
      if ([c.idd.root, c.idd.suffixes[i]].join('') === searchVal) {
        return true
      }
    }
    return false
  })

  return filteredToResult(filtered)
}

/**
 * Searches properties that contain a list of names/demonyms keyed by language code:
 *
 *   {
 *     "nld": { "official": "Aruba", "common": "Aruba" },
 *     "pap": { "official": "Aruba", "common": "Aruba" }
 *   }
 *   {
 *     "eng": { "f": "Irish", "m": "Irish" },
 *     "fra": { "f": "Irlandaise", "m": "Irlandais" }
 *   }
 *
 * @param  {string} propPath A property path
 * @param  {string} value    The name to find
 * @param  {boolean}  exact    search exactly same or part
 * @return {null | Country | Country[]}           See filteredToResult
 */
function findByLangKeyedName(propPath, value, exact) {
  var searchVal = lowerCaseIfNeeded(value)
  // "propPath": {
  //   "nld": { "official": "Aruba", "common": "Aruba"},
  //   "pap": {"official": "Aruba", "common": "Aruba"}
  // }
  var filtered = _.filter(cs, function (v) {
    var nameObj = _.get(v, propPath)

    for (var langKey in nameObj) {
      if (
        (exact &&
          (lowerCaseIfNeeded(nameObj[langKey].official) === searchVal ||
            lowerCaseIfNeeded(nameObj[langKey].common) === searchVal ||
            lowerCaseIfNeeded(nameObj[langKey].f) === searchVal ||
            lowerCaseIfNeeded(nameObj[langKey].m) === searchVal)) ||
        (!exact &&
          (lowerCaseIfNeeded(nameObj[langKey].official)?.includes(searchVal) ||
            lowerCaseIfNeeded(nameObj[langKey].common)?.includes(searchVal) ||
            lowerCaseIfNeeded(nameObj[langKey].f)?.includes(searchVal) ||
            lowerCaseIfNeeded(nameObj[langKey].m)?.includes(searchVal)))
      ) {
        return true
      }
    }

    return false
  })

  return filteredToResult(filtered)
}

/**
 * Searches properties that contain a key/value map.
 * @param  {string} prop  A property name
 * @param  {string | number}  value Value to find
 * @return {null | Country | Country[]}        See filteredToResult
 */
function findByMapProp(prop, value) {
  var searchVal = lowerCaseIfNeeded(value)
  var filtered = _.filter(cs, function (c) {
    return _(c[prop])
      .values()
      .some(function (v) {
        return lowerCaseIfNeeded(v) === searchVal
      })
  })

  return filteredToResult(filtered)
}

/**
 * Searches properties that contain string values.
 * @param  {string} prop  Name of the prop to search by
 * @param  {string | number}  value Value to find
 * @return {null | Country | Country[]}        See filteredToResult
 */
function findByStringProp(prop, value) {
  var searchVal = lowerCaseIfNeeded(value)
  var filtered = _.filter(cs, function (c) {
    var comp = lowerCaseIfNeeded(c[prop])
    return comp === searchVal
  })

  return filteredToResult(filtered)
}

/**
 * Converts a value to lower case if necessary (i.e. if it is a string).
 * @param  {string | number} value Value to (possible) lower-case
 * @return {string | number}       Lower-cased string, if `value` is a string, or unchanged `value`, otherwise.
 */
function lowerCaseIfNeeded(value) {
  return typeof value === 'string' ? value.toLowerCase() : value
}

/**
 * Converts a value to upper case if necessary (i.e. if it is a string).
 * @param  {string | number} value Value to (possible) upper-case
 * @return {string | number}       Upper-cased string, if `value` is a string, or unchanged `value`, otherwise.
 */
function upperCaseIfNeeded(value) {
  return typeof value === 'string' ? value.toUpperCase() : value
}

/**
 * Takes a filtered array as returned by lodash and returns the appropriate
 * value for returning from Countries.find()
 * @param  {array} filtered
 * @return {null | Country | Country[]} null when filtered is empty, an object when filtered
 *                                      only contains 1 result or the whole of 'filtered'
 *                                      otherwise
 */
function filteredToResult(filtered) {
  switch (filtered.length) {
    case 0:
      return null

    case 1:
      return _.first(filtered)

    default:
      return filtered
  }
}

module.exports = CountryQuery
