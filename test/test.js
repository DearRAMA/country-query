/* eslint-env mocha */
var expect = require('chai').expect
var CountryQuery = require('../lib/country-query.js')

describe('CountryQuery', function () {
  describe('#find()', function () {
    it('should return an object when finding by uniquely identifiable string properties', function () {
      expect(CountryQuery.find('cca2', 'AW')).to.have.property('cca3', 'ABW')
      expect(CountryQuery.find('ccn3', '533')).to.have.property('cca3', 'ABW')
      expect(CountryQuery.find('cca3', 'ABW')).to.have.property('cca3', 'ABW')
      expect(CountryQuery.find('capital', 'Oranjestad')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('demonyms', 'Aruban')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('cca2', 'AT')).to.have.property('cca3', 'AUT')
      expect(CountryQuery.find('cioc', 'RUS')).to.have.property('cca3', 'RUS')
    })

    it('should return an array when finding by non-uniquely identifiable string properties', function () {
      var caribCountries = CountryQuery.find('subregion', 'caribbean')
      var aruba = CountryQuery.find('cca2', 'AW')

      expect(caribCountries).to.be.an('array').and.have.length(28)
      expect(caribCountries).to.include(aruba)
    })

    it('should return an object when finding by uniquely identifiable array properties', function () {
      expect(CountryQuery.find('altSpellings', 'AW')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('currencies', 'AWG')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('tld', '.aw')).to.have.property('cca3', 'ABW')
      expect(CountryQuery.find('altSpellings', 'Osterreich')).to.have.property(
        'cca3',
        'AUT'
      )
    })

    it('should return an array when finding by non-uniquely identifiable array properties', function () {
      var gbpCountries = CountryQuery.find('currencies', 'gbp')
      var uk = CountryQuery.find('cca2', 'GB')

      expect(gbpCountries).to.be.an('array').and.have.length(6)
      expect(gbpCountries).to.include(uk)
    })

    it('should return an object when finding by uniquely identifiable deep string properties', function () {
      expect(CountryQuery.find('name.common', 'Aruba')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('name.official', 'Aruba')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('name.native', 'Aruba')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('translations', 'Aruba')).to.have.property(
        'cca3',
        'ABW'
      )
      expect(CountryQuery.find('translations', 'Australie')).to.have.property(
        'cca3',
        'AUS'
      )
    })

    it('should return an object when finding by uniquely identifiable properties that contain maps', function () {
      expect(CountryQuery.find('languages', 'Tuvaluan')).to.have.property(
        'cca3',
        'TUV'
      )
      expect(CountryQuery.find('languages', 'Czech')).to.have.property(
        'cca3',
        'CZE'
      )
    })

    it('should return an array when finding by non-uniquely identifiable properties that contain maps', function () {
      var italian = CountryQuery.find('languages', 'Italian'),
        switz = CountryQuery.find('cca2', 'CH'),
        italy = CountryQuery.find('cca2', 'IT')

      expect(italian).to.be.an('array').and.have.length(4)
      expect(italian).to.include(switz).and.to.include(italy)
    })

    it('should return null for searches that return nothing', function () {
      var nullTests = [
        { field: 'cca2', value: 'XX' },
        { field: 'ccn3', value: '000' },
        { field: 'cca3', value: 'XXX' },
        { field: 'capital', value: 'XXXXX' },
        { field: 'demonyms', value: 'XXXXXXX' },
      ]
      nullTests.forEach(function (test) {
        expect(CountryQuery.find(test.field, test.value)).to.be.null
      })
    })

    it('should return null for non-existent properties', function () {
      var nullTests = [
        { field: 'cant-find-me', value: 'XX' },
        { field: '', value: 'XX' },
        { field: null, value: 'XX' },
      ]

      nullTests.forEach(function (test) {
        expect(CountryQuery.find(test.field, test.value)).to.be.null
      })
    })
  })

  it('should be case insensitive', function () {
    expect(CountryQuery.find('cca2', 'aw')).to.have.property('cca3', 'ABW')
    expect(CountryQuery.find('capital', 'oranjestad')).to.have.property(
      'cca3',
      'ABW'
    )
    expect(CountryQuery.find('altSpellings', 'aw')).to.have.property(
      'cca3',
      'ABW'
    )
    expect(CountryQuery.find('name.common', 'aruba')).to.have.property(
      'cca3',
      'ABW'
    )
    expect(CountryQuery.find('languages', 'tuvaluan')).to.have.property(
      'cca3',
      'TUV'
    )
  })

  describe('#findByX()', function () {
    it('should behave the same as the equivalent plain find', function () {
      var findSingleTests = [
        {
          field: 'altSpellings',
          value: 'Oesterreich',
          findFunc: 'findByAltSpelling',
          expectCca3: 'AUT',
        },
        {
          field: 'altSpellings',
          value: 'oesterreich',
          findFunc: 'findByAltSpelling',
          expectCca3: 'AUT',
        },
        { field: 'area', value: 6, findFunc: 'findByArea', expectCca3: 'GIB' },
        {
          field: 'idd',
          value: '355',
          findFunc: 'findByIdd',
          expectCca3: 'ALB',
        },
        {
          field: 'capital',
          value: 'Guatemala City',
          findFunc: 'findByCapital',
          expectCca3: 'GTM',
        },
        {
          field: 'cca2',
          value: 'PL',
          findFunc: 'findByCca2',
          expectCca3: 'POL',
        },
        {
          field: 'cca3',
          value: 'GNQ',
          findFunc: 'findByCca3',
          expectCca3: 'GNQ',
        },
        {
          field: 'ccn3',
          value: '056',
          findFunc: 'findByCcn3',
          expectCca3: 'BEL',
        },
        {
          field: 'cioc',
          value: 'RWA',
          findFunc: 'findByCioc',
          expectCca3: 'RWA',
        },
        {
          field: 'demonyms',
          value: 'Qatari',
          findFunc: 'findByDemonym',
          expectCca3: 'QAT',
        },
        {
          field: 'languages',
          value: 'Azerbaijani',
          findFunc: 'findByLanguage',
          expectCca3: 'AZE',
        },
        {
          field: 'name.common',
          value: 'Argentina',
          findFunc: 'findByNameCommon',
          expectCca3: 'ARG',
        },
        {
          field: 'name.official',
          value: 'Argentine Republic',
          findFunc: 'findByNameOfficial',
          expectCca3: 'ARG',
        },
        {
          field: 'name.native',
          value: 'Rep\u00fablica Argentina',
          findFunc: 'findByNameNative',
          expectCca3: 'ARG',
        },
        {
          field: 'name.native',
          value: 'rep\u00fablica argentina',
          findFunc: 'findByNameNative',
          expectCca3: 'ARG',
        },
        {
          field: 'tld',
          value: '.ao',
          findFunc: 'findByTld',
          expectCca3: 'AGO',
        },
        {
          field: 'translations',
          value: 'Prinsdom Andorra',
          findFunc: 'findByTranslation',
          expectCca3: 'AND',
        },
        {
          field: 'currencies',
          value: 'VES',
          findFunc: 'findByCurrency',
          expectCca3: 'VEN',
        },
      ]

      findSingleTests.forEach(function (test) {
        var findByXResult = CountryQuery[test.findFunc].call(
            CountryQuery,
            test.value
          ),
          findResult = CountryQuery.find(test.field, test.value)

        expect(findByXResult).to.deep.equal(findResult)
        expect(findByXResult).to.have.property('cca3', test.expectCca3)
      })

      var findArrayTests = [
        {
          field: 'borders',
          value: 'AFG',
          findFunc: 'findByBorders',
          expectLength: 6,
        },
        {
          field: 'borders',
          value: 'afg',
          findFunc: 'findByBorders',
          expectLength: 6,
        },
        {
          field: 'currencies',
          value: 'GBP',
          findFunc: 'findByCurrency',
          expectLength: 6,
        },
        {
          field: 'landlocked',
          value: true,
          findFunc: 'findByLandlocked',
          expectLength: 45,
        },
        {
          field: 'region',
          value: 'Africa',
          findFunc: 'findByRegion',
          expectLength: 59,
        },
        {
          field: 'subregion',
          value: 'Western Africa',
          findFunc: 'findBySubregion',
          expectLength: 17,
        },
      ]

      findArrayTests.forEach(function (test) {
        var findByXResult = CountryQuery[test.findFunc].call(
            CountryQuery,
            test.value
          ),
          findResult = CountryQuery.find(test.field, test.value)

        expect(findByXResult).to.deep.equal(findResult)
        expect(findByXResult).to.have.length(test.expectLength)
      })
    })
  })
})
