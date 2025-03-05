import { readFileSync } from 'fs'

export class FileHandler {
  static read(): object[] {
    try {
      const data = readFileSync('./data/airports.json', 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading JSON: ${error}`)
    }
    throw new Error('Could not read data file')
  }
}

export class ArgumentHandler {}
