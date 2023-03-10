import { join } from 'path'
import * as url from 'url'
import { CSVFile } from '../utils/csv-file.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export class Program {
  /**
   *
   * @param {import('../utils/csv-file').CSVFile} csvFileHandler /
   */
  constructor(csvFileHandler) {
    this.csvFileHandler = csvFileHandler

    this.main = this.main.bind(this)
  }

  multiplyPopulationByTwo(mapData = []) {
    return mapData.reduce((accumulator, item) => {
      const { local, lastCensusPopulation } = item

      accumulator.push({
        local,
        lastCensusPopulation: parseInt(lastCensusPopulation) * 2,
      })

      return accumulator
    }, [])
  }

  async main({ filepath = join(__dirname, './../mapa.csv') } = {}) {
    console.info('Iniciando a tarefa 1...')
    const options = {
      fields: ['Local', 'População no último censo'],
      mapFields: {
        Local: 'local',
        'População no último censo': 'lastCensusPopulation',
      },
    }

    const mapData = await this.csvFileHandler.csvToJSON(filepath, options)

    const multipliedMapData = this.multiplyPopulationByTwo(mapData)

    const newCSVFile = this.csvFileHandler.parseJSONToCSV(multipliedMapData, {
      mapFields: {
        local: 'Local',
        lastCensusPopulation: 'População no último censo',
      },
    })

    const newFilepath = join(
      __dirname,
      './../results/mapa.multiplied-by-two.csv'
    )

    await this.csvFileHandler.writeCSVFile(newFilepath, newCSVFile)

    console.info(
      `Arquivo gerado com sucesso em: ${newFilepath}`
    )
    console.info('Tarefa 1 finalizada!')
  }

  static async run() {
    const csvFileHandler = new CSVFile()
    const program = new Program(csvFileHandler)

    await program.main()
  }
}

Program.run()
