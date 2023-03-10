import { deepStrictEqual, equal } from 'assert'
import { join } from 'path'
import { CSVFile } from './csv-file.js'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  {
    console.info('[CSVFile] should parse a CSV file to JSON')
    const filepath = join(__dirname, './../tests/mocks/csv/mapa.valid.csv')
    const options = {
      fields: ['Local', 'População no último censo'],
      mapFields: {
        Local: 'local',
        'População no último censo': 'lastCensusPopulation',
      },
    }
    const expectedResponse = [
      {
        local: 'Angra dos Reis',
        lastCensusPopulation: 169511,
      },
      {
        local: 'Aperibé',
        lastCensusPopulation: 10213,
      },
    ]

    const sut = new CSVFile()

    const response = await sut.csvToJSON(filepath, options)
    deepStrictEqual(
      response,
      expectedResponse,
      '[CSVFile] should parse a CSV file to JSON'
    )
    console.info('OK!')
  }

  {
    console.info('[CSVFile] should parse a JSON to CSV')
    const options = {
      mapFields: {
        local: 'Local',
        lastCensusPopulation: 'População no último censo',
      },
    }

    const mockedJSON = [
      {
        local: 'Angra dos Reis',
        lastCensusPopulation: '169511',
      },
      {
        local: 'Aperibé',
        lastCensusPopulation: '10213',
      },
    ]

    const expectedResponse =
      '"Local"; "População no último censo"\n' +
      '"Angra dos Reis"; 169511\n' +
      '"Aperibé"; 10213\n'

    const sut = new CSVFile()

    const response = sut.parseJSONToCSV(mockedJSON, options)

    equal(
      response.trim(),
      expectedResponse.trim(),
      '[CSVFile] should parse a JSON file to CSV'
    )
    console.info('OK!')
  }

  {
    console.info('[CSVFile] shoud find all possible headers from JSON')

    const mockedJSON = [
      {
        local: 'Angra dos Reis',
        lastCensusPopulation: '169511',
      },
      {
        local: 'Aperibé',
        anyOtherField: '123',
      },
    ]

    const expectedResponse = ['local', 'lastCensusPopulation', 'anyOtherField']

    const sut = new CSVFile()

    const response = sut.findAllPossibleHeadersFromJSON(mockedJSON)

    deepStrictEqual(
      response,
      expectedResponse,
      '[CSVFile] shoud find all possible headers from JSON'
    )

    console.info('OK!')
  }
})()
