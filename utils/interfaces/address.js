export class Address {
  constructor({ cep, street, neighborhood, city, state, complement, ibge, gia, ddd }) {
    this.cep = cep
    this.street = street
    this.neighborhood = neighborhood
    this.city = city
    this.state = state
    this.complement = complement
    this.ibge = ibge
    this.gia = gia
    this.ddd = ddd
  }
}
