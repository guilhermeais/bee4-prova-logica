import { Address } from '../interfaces/address.js'
import { CepService } from '../interfaces/cep-service.js'

export class CepServiceSpy extends CepService {
  constructor() {
    super()
    this.findAddressByCepParams = []
    this.findAddressByCepResult = new Address({
      cep: '14430000',
      street: 'Rua 1',
      city: 'Franca',
      complement: 'Casa 1',
      neighborhood: 'Jardim Paulista',
      ddd: '16',
      gia: '1',
      ibge: '1',
      state: 'SP',
    })
  }
  async findAddressByCep(cep) {
    this.findAddressByCepParams.push(cep)
    return this.findAddressByCepResult
  }
}
