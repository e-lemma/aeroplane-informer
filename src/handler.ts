import { readFileSync } from 'fs'
import { Command } from 'commander'

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

export class ArgumentHandler {
  static parseArgument(): string {
    const program = new Command()
    program.option('-a, --airport <name>', 'name of the airport')
    program.parse()
    return program.opts().airport
  }
}
