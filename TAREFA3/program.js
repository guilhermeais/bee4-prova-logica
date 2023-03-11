import { join } from 'path'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
import { ViaCepCepService } from '../utils/gateway/viacep-cep-service.js'
import { CSVFile } from '../utils/csv-file.js'

export class Program {
  /**
   * @param {import('../utils/interfaces/cep-service').CepService} cepService
   * @param {CSVFile} csvFileHandler
   */
  constructor(cepService, csvFileHandler) {
    this.cepService = cepService
    this.csvFileHandler = csvFileHandler

    this.main = this.main.bind(this)
  }

  normalizeCEP(cep) {
    return cep.replace(/\D/g, '')
  }

  async main({ filepath = join(__dirname, './../CEPs.csv') } = {}) {
    console.info('Iniciando tarefa 3...')
    const addressesWithoutCep = await this.csvFileHandler.csvToJSON(filepath, {
      fields: [
        'CEP',
        'Logradouro',
        'Complemento',
        'Bairro',
        'Localidade',
        'UF',
        'Unidade',
        'IBGE',
        'GIA',
      ],
    })

    const addressesWithCep = await Promise.all(
      addressesWithoutCep.map(async address => {
        address.CEP = this.normalizeCEP(address.CEP.toString())
        try {
          console.info(`Buscando CEP para o endereço ${address.CEP}...`)
          const addressWithCep = await this.cepService.findAddressByCep(
            address.CEP
          )
          return {
            CEP: address.CEP,
            Logradouro: addressWithCep?.street || 'Informação não encontrada',
            Complemento:
              addressWithCep?.complement || 'Informação não encontrada',
            Bairro: addressWithCep?.neighborhood || 'Informação não encontrada',
            Localidade: addressWithCep?.city || 'Informação não encontrada',
            UF: addressWithCep?.state || 'Informação não encontrada',
            Unidade: addressWithCep?.ddd || 'Informação não encontrada',
            IBGE: addressWithCep?.ibge || 'Informação não encontrada',
            GIA: addressWithCep?.gia || 'Informação não encontrada',
          }
        } catch (error) {
          console.error(`CEP ${address.CEP}: `,error.message)
          return {
            CEP: address.CEP,
            Logradouro: 'CEP não encontrado ou inválido',
            Complemento: 'CEP não encontrado ou inválido',
            Bairro: 'CEP não encontrado ou inválido',
            Localidade: 'CEP não encontrado ou inválido',
            UF: 'CEP não encontrado ou inválido',
            Unidade: 'CEP não encontrado ou inválido',
            IBGE: 'CEP não encontrado ou inválido',
            GIA: 'CEP não encontrado ou inválido',
          }
        }
      })
    )

    const addressessWithCepCSV =
      this.csvFileHandler.parseJSONToCSV(addressesWithCep)

    const newFilepath = join(__dirname, './../results/CEPs-with-address.csv')
    await this.csvFileHandler.writeCSVFile(newFilepath, addressessWithCepCSV)

    console.info('Tarefa 3 finalizada com sucesso!')
    console.info(`Arquivo gerado com sucesso em: ${newFilepath}`)
  }

  static async run() {
    const cepService = new ViaCepCepService()
    const csvFileHandler = new CSVFile()

    const program = new Program(cepService, csvFileHandler)
    await program.main()
  }
}