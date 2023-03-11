import { deepStrictEqual } from 'assert'
import { join } from 'path'
import { Program } from './program.js'
import * as url from 'url'
import { CSVFile } from '../utils/csv-file.js'
import { CepServiceSpy } from '../utils/gateway/cep-service-spy.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  {
    let writeCSVFileContent = null
    CSVFile.prototype.writeCSVFile = (filepath, content) => {
      writeCSVFileContent = content
      return Promise.resolve()
    }
    const csvFileHandler = new CSVFile()
    const cepServiceSpy = new CepServiceSpy()
    const sut = new Program(cepServiceSpy, csvFileHandler)
    const rawCep = '14430-000'
    const expected = '14430000'
    const actual = sut.normalizeCEP(rawCep)

    deepStrictEqual(actual, expected, '[TAREFA3] x should normalize the cep')

    console.info('[TAREFA3] ✔️ should normalize the cep')
  }

  {
    let writeCSVFileContent = null
    CSVFile.prototype.writeCSVFile = (filepath, content) => {
      writeCSVFileContent = content
      return Promise.resolve()
    }
    const csvFileHandler = new CSVFile()
    const cepServiceSpy = new CepServiceSpy()
    const sut = new Program(cepServiceSpy, csvFileHandler)
    const filepath = join(__dirname, './../tests/mocks/csv/CEPs.valid.csv')
    const expectedCeps = ['22630100', '22776000']
    await sut.main({
      filepath,
    })

    deepStrictEqual(
      expectedCeps,
      cepServiceSpy.findAddressByCepParams,
      '[TAREFA3] x should call cepService.findAddressByCep with all cep locations'
    )

    console.info(
      '[TAREFA3] ✔️ should call cepService.findAddressByCep with all cep locations'
    )
  }

  {
    let writeCSVFileContent = null
    CSVFile.prototype.writeCSVFile = (filepath, content) => {
      writeCSVFileContent = content
      return Promise.resolve()
    }
    const csvFileHandler = new CSVFile()
    const cepServiceSpy = new CepServiceSpy()
    const sut = new Program(cepServiceSpy, csvFileHandler)
    const filepath = join(__dirname, './../tests/mocks/csv/CEPs.valid.csv')
    const expectedCSV =
      '"CEP"; "Logradouro"; "Complemento"; "Bairro"; "Localidade"; "UF"; "Unidade"; "IBGE"; "GIA"\n' +
      '22630100; "Rua 1"; "Casa 1"; "Jardim Paulista"; "Franca"; "SP"; 16; 1; 1\n' +
      '22776000; "Rua 1"; "Casa 1"; "Jardim Paulista"; "Franca"; "SP"; 16; 1; 1'
    await sut.main({
      filepath,
    })

    deepStrictEqual(
      writeCSVFileContent,
      expectedCSV,
      '[TAREFA3] x should create a new csv file with the addresses filled'
    )

    console.info(
      '[TAREFA3] ✔️ should create a new csv file with the addresses filled'
    )
  }

  {
    let writeCSVFileContent = null
    CSVFile.prototype.writeCSVFile = (filepath, content) => {
      writeCSVFileContent = content
      return Promise.resolve()
    }
    const csvFileHandler = new CSVFile()
    const cepServiceSpy = new CepServiceSpy()
    cepServiceSpy.findAddressByCepResult.city = null
    const sut = new Program(cepServiceSpy, csvFileHandler)
    const filepath = join(__dirname, './../tests/mocks/csv/CEPs.valid.csv')
    const expectedCSV =
      '"CEP"; "Logradouro"; "Complemento"; "Bairro"; "Localidade"; "UF"; "Unidade"; "IBGE"; "GIA"\n' +
      '22630100; "Rua 1"; "Casa 1"; "Jardim Paulista"; "Informação não encontrada"; "SP"; 16; 1; 1\n' +
      '22776000; "Rua 1"; "Casa 1"; "Jardim Paulista"; "Informação não encontrada"; "SP"; 16; 1; 1'
    await sut.main({
      filepath,
    })

    deepStrictEqual(
      writeCSVFileContent,
      expectedCSV,
      '[TAREFA3] x should fill the field with "Informação não encontrada" if the information was not provided from the cep service'
    )

    console.info(
      '[TAREFA3] ✔️ should fill the field with "Informação não encontrada" if the information was not provided from the cep service'
    )
  }

  {
    let writeCSVFileContent = null
    CSVFile.prototype.writeCSVFile = (filepath, content) => {
      writeCSVFileContent = content
      return Promise.resolve()
    }
    const csvFileHandler = new CSVFile()
    const mockedError = new Error('mocked error')

    CepServiceSpy.prototype.findAddressByCep = () => {
      throw mockedError
    }

    const cepServiceSpy = new CepServiceSpy()
    const sut = new Program(cepServiceSpy, csvFileHandler)
    const filepath = join(__dirname, './../tests/mocks/csv/CEPs.valid.csv')
    const expectedCSV =
      '"CEP"; "Logradouro"; "Complemento"; "Bairro"; "Localidade"; "UF"; "Unidade"; "IBGE"; "GIA"\n' +
      '22630100; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"\n' +
      '22776000; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"; "CEP não encontrado ou inválido"'
    await sut.main({
      filepath,
    })

    deepStrictEqual(
      writeCSVFileContent,
      expectedCSV,
      '[TAREFA3] x should fill the field with "CEP não encontrada ou inválido" if the cep was not found or throw an error'
    )

    console.info(
      '[TAREFA3] ✔️ should fill the field with "CEP não encontrada ou inválido" if the cep was not found or throw an error'
    )
  }
})()
