import { deepStrictEqual } from 'assert'
import { join } from 'path'
import { Program } from './program.js'
import * as url from 'url'
import { CSVFile } from '../utils/csv-file.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  {
    const sut = new Program()
    const array = [
      {
        local: 'Restinga',
        lastCensusPopulation: 4,
      },
      {
        local: 'Angra dos Reis',
        lastCensusPopulation: 1,
      },
      {
        local: 'Franca',
        lastCensusPopulation: 5,
      },
      {
        local: 'Aperibé',
        lastCensusPopulation: 2,
      },
    ]
    const expected = [
      {
        local: 'Angra dos Reis',
        lastCensusPopulation: 1,
      },
      {
        local: 'Aperibé',
        lastCensusPopulation: 2,
      },
      {
        local: 'Restinga',
        lastCensusPopulation: 4,
      },
      {
        local: 'Franca',
        lastCensusPopulation: 5,
      },
    ]

    const actual = sut.bubbleSortByLastCensusPopulation(array)

    deepStrictEqual(
      actual,
      expected,
      ' x should sort an array of locations using bubble sort at the property lastCensusPopulation'
    )

    console.info(
      '[TAREFA2] ✔️ should sort an array of locations using bubble sort at the property lastCensusPopulation'
    )
  }

  {
    let writeCSVFileContent = null
    CSVFile.prototype.writeCSVFile = (filepath, content) => {
      writeCSVFileContent = content
      return Promise.resolve()
    }
    const csvFileHandler = new CSVFile()

    const sut = new Program(csvFileHandler)

    const filepath = join(
      __dirname,
      './../tests/mocks/csv/mapa-more-data.valid.csv'
    )

    const expectedResponse =
      '"Local"; "População no último censo"\n' +
      '"Ribeirão Preto"; 100\n' +
      '"Angra dos Reis"; 150\n' +
      '"Aperibé"; 200\n' +
      '"Restinga"; 365\n' +
      '"Franca"; 500'

    await sut.main({
      filepath,
    })

    deepStrictEqual(
      writeCSVFileContent,
      expectedResponse,
      '[TAREFA1] x should order the locations by the last census population'
    )

    console.info('[TAREFA1] ✔️ should order the locations by the last census population')
  }
})()
