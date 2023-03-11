import { Address } from '../interfaces/address.js'
import { CepService } from '../interfaces/cep-service.js'
import { errors } from '../constants/errors.js'
import axios from 'axios'
/**
 * @implements {CepService}
 */
export class ViaCepCepService extends CepService {
  constructor() {
    super()
    this.api = axios.create({
      baseURL: 'https://viacep.com.br/ws/',
    })
  }
  /**
   * @param {string} cep
   * @returns {Promise<Address>}
   */
  async findAddressByCep(cep) {
    const { data, status } = await this.api.get(`${cep}/json/`, {
      headers: {
        "Content-Type": "application/json",
      },
       
    })
    
    const isClientError = status >= 400 && status < 500

    if (isClientError) {
      throw new Error(errors.INVALID_CEP)
    }

    const address = new Address({
      cep: data.cep,
      city: data.localidade,
      neighborhood: data.bairro,
      country: 'Brasil',
      state: data.uf,
      street: data.logradouro,
      complement: data.complemento,
      gia: data.gia,
      ibge: data.ibge,
      ddd: data.ddd,
    })


    return address
  }
}
