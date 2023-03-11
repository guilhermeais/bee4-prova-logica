import { join } from 'path'
import * as url from 'url'
import { CSVFile } from '../utils/csv-file.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export class Program {
  /**
   * @param {import('../utils/csv-file').CSVFile} csvFileHandler
   */
  constructor(csvFileHandler) {
    this.csvFileHandler = csvFileHandler
    this.main = this.main.bind(this)
  }

  bubbleSortByLastCensusPopulation(array) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - 1; j++) {
        if (array[j].lastCensusPopulation > array[j + 1].lastCensusPopulation) {
          const temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp
        }
      }
    }

    return array
  }

  async main({ filepath = join(__dirname, './../mapa.csv') } = {}) {
    console.info('Iniciando a tarefa 2...')

    const unorderedMap = await this.csvFileHandler.csvToJSON(filepath, {
      fields: ['Local', 'População no último censo'],
      mapFields: {
        Local: 'local',
        'População no último censo': 'lastCensusPopulation',
      },
    })

    const orderedMap = this.bubbleSortByLastCensusPopulation(unorderedMap)

    const newCSVFile = this.csvFileHandler.parseJSONToCSV(orderedMap, {
      mapFields: {
        local: 'Local',
        lastCensusPopulation: 'População no último censo',
      },
    })

    const newFilepath = join(
      __dirname,
      './../results/mapa.ordered-with-bubble-sort.csv'
    )

    await this.csvFileHandler.writeCSVFile(newFilepath, newCSVFile)

    console.info(`Arquivo gerado com sucesso em: ${newFilepath}`)
  }

  static async run() {
    const csvFileHandler = new CSVFile()

    const program = new Program(csvFileHandler)
    await program.main()
  }
}