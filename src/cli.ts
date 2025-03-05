import {
  RawFlightData,
  RawWeatherData,
  TransformedFlightData,
  Airport,
} from './interface.js'
import { FileHandler, ArgumentHandler } from './handler.js'
import { FlightService, WeatherService } from './service.js'
import { input, select } from '@inquirer/prompts'
import { match } from 'assert'

export class AeroplaneSearcherCLI {
  /*
   * Gets name of airport from user
   * From command line argument, or user input in cli
   * Find all airports that match the name
   * if theres only one match, select automatically
   * Find all the flights leaving that airport
   * Extract the location of all of the destinations of the airports
   * Combine that data with the weather at each of the destinations of the flights
   * Export this data to a HTML file
   */

  async start() {
    this.printGreeting()
    const foundMatches = this.getMatches(await this.getUserInput())
    const matchingAirport = this.getChoiceFromMatches(foundMatches)
    console.log(await matchingAirport)
  }

  printGreeting(): void {
    console.log('Welcome to the aeroplane searcher!')
  }

  async getUserInput(): Promise<string> {
    const airportArgument = ArgumentHandler.parseArgument()

    if (!airportArgument) {
      const userInput = await input({
        message: 'Enter an airport:',
        required: true,
      })

      return userInput.trim().toLowerCase()
    }
    return airportArgument.trim().toLowerCase()
  }

  getMatches(input: string): Airport[] {
    const airports: Airport[] = FileHandler.read()

    const matches = airports.filter((airport: Airport) => {
      if (airport.name !== null) {
        return airport.name.toLowerCase().includes(input)
      }
    })

    return matches
  }

  private createAirportSelection(airports: Airport[]) {
    return airports.map((airport: Airport) => ({
      name: airport.name,
      value: airport,
    }))
  }

  async getChoiceFromMatches(matches: Airport[]): Promise<string> {
    if (matches.length === 0) {
      throw new Error('Could not find any airports matching that name.')
    } else if (matches.length === 1) {
      return matches[0].iata
    } else {
      const selectedAirport = await select({
        message: 'Multiple airports found, please select one:',
        choices: this.createAirportSelection(matches),
      })
      return selectedAirport.iata
    }
  }
}
