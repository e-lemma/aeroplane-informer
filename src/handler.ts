import { readFileSync, writeFileSync } from 'fs'
import { Command } from 'commander'
import { Airport, TransformedFlightData } from './interface.js'

export class FileHandler {
  static read(): Airport[] {
    try {
      const data = readFileSync('./data/airports.json', 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading JSON: ${error}`)
    }
    throw new Error('Could not read data file')
  }

  static exportAsJSON(data: TransformedFlightData[]): void {
    try {
      const getTimestamp = (): string => {
        const currentDate = new Date()
        return currentDate.toISOString().replace(/[:.]/g, '-')
      }
      writeFileSync(
        `./data/exports/${getTimestamp()}.json`,
        JSON.stringify(data, null, 2),
      )
      console.log('Changes saved!')
    } catch (error) {
      console.error(`Error writing JSON: ${error}`)
      throw error
    }
  }
}

export class ArgumentHandler {
  static parseArgument(): string {
    const program = new Command()
    program.option('-a, --airport <name>', 'name of the airport')
    program.parse()
    return program.opts().airport
  }
}
