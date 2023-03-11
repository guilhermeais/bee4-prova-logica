import { readFile, writeFile } from 'fs/promises'
import { errors } from './constants/errors.js'

export class CSVFile {
  async readCSVFile(path, options = { fields: [] }) {
    const csv = (await readFile(path)).toString()

    const validation = this.isValid(csv, options)

    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    return csv
  }

  async writeCSVFile(path, content) {
    return writeFile(path, content)
  }

  /**
   * @param {string} filepath
   * @param {object} options
   * @param {object} options.mapFields
   * @param {string[]} options.fields
   * @returns {Promise<object[]>}
   */
  async csvToJSON(filepath, options = { mapFields: {}, fields: [] }) {
    const content = await this.readCSVFile(filepath, options)

    return this.parseCSVToJSON(content, options)
  }

  findAllPossibleHeadersFromJSON(json = []) {
    return json.reduce((accumulator, item) => {
      const keys = Object.keys(item)

      for (const key of keys) {
        if (!accumulator.includes(key)) {
          accumulator.push(key)
        }
      }

      return accumulator
    }, [])
  }

  parseJSONToCSV(rawJson, options = { mapFields: {} }) {
    const json = Array.isArray(rawJson) ? rawJson : [rawJson]

    const allPossibleHeaders = this.findAllPossibleHeadersFromJSON(json)

    const mappedHeaders = allPossibleHeaders.map(header => {
      if (options.mapFields[header]) {
        return options.mapFields[header]
      }

      return header
    })

    const csvHeaders = mappedHeaders.map(h => `"${h}"`).join('; ') + '\n'

    const csvBody = json
      .map(row => {
        const mappedRow = allPossibleHeaders.map(header => {
          const value = row[header]

          if (value) {
            const isNumber = !isNaN(value)
            return typeof value === 'string' && !isNumber ? `"${value}"` : value
          }

          return ''
        })

        return mappedRow.join('; ')
      })
      .join('\n')

    return csvHeaders + csvBody
  }

  parseCSVToJSON(csvString, options = { mapFields: {} }) {
    const lines = csvString.split('\n')
    const nonEmptyLines = lines.filter(Boolean)
    const firstLine = nonEmptyLines.shift()
    const headers = firstLine.split(';')

    const parsedToJSON = nonEmptyLines.map(line => {
      const rows = line.split(';')
      let csvAsJSON = {}

      for (const columnIndex in rows) {
        let column = headers[columnIndex]
        column = column.replace(/"/g, '').trim()

        const value = rows[columnIndex].replace(/"/g, '').trim()

        if (options?.mapFields?.[column]) {
          column = options.mapFields[column]
        }

        if (value) {
          const isNumber = !isNaN(value)
          csvAsJSON[column] =
            typeof value === 'string' && !isNumber ? value : parseInt(value)
        }
      }

      return csvAsJSON
    })

    return parsedToJSON
  }

  isValid(csvString, options = { fields: [] }) {
    const [header] = csvString.split('\n')
    const isHeaderValid =
      header === options.fields.map(field => `"${field}"`).join('; ') ||
      header === options.fields.join(';')

    if (!isHeaderValid) {
      return {
        isValid: false,
        error: errors.INVALID_HEADERS,
      }
    }

    return {
      isValid: true,
    }
  }
}
