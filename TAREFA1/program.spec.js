import { deepStrictEqual } from 'assert'
import { join } from 'path'
import { Program } from './program.js'
import * as url from 'url'
import { CSVFile } from '../utils/csv-file.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  {
    console.info('[TAREFA1] should multiply all population by two')
    const csvFileHandler = new CSVFile()
    let writeCSVFileContent = null

    Reflect.defineProperty(csvFileHandler, 'writeCSVFile', {
      value: (filepath, content) => {
        writeCSVFileContent = content
        return Promise.resolve()
      },
    })

    const sut = new Program(csvFileHandler)

    const filepath = join(__dirname, './../tests/mocks/csv/mapa.valid.csv')

    const expectedResponse =
      '"Local"; "População no último censo"\n' +
      '"Angra dos Reis"; 339022\n' +
      '"Aperibé"; 20426'

    await sut.main({
      filepath,
    })

    deepStrictEqual(
      writeCSVFileContent,
      expectedResponse,
      '[TAREFA1] should multiply all population by two'
    )

    console.info('OK!')
  }
})()
