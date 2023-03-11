import { Address } from './address.js'

/**
 * @abstract
 */
export class CepService {
  /**
   * @abstract
   * @param {string} cep
   * @returns {Promise<Address>}
   */
  async findAddressByCep(cep) {}
}
