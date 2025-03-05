import {
  RawFlightData,
  RawWeatherData,
  TransformedFlightData,
  Airport,
} from './interface.js'
import { FileHandler, ArgumentHandler } from './handler.js'
import { FlightService, WeatherService } from './service.js'
import { input, select } from '@inquirer/prompts'

export class AeroplaneSearcherCLI {
  private readonly loadedAirportData: Airport[] = FileHandler.read()
  /*
   * Find all the flights leaving that airport
   * Extract the location of all of the destinations of the airports
   * Combine that data with the weather at each of the destinations of the flights
   * Export this data to a HTML file
   */

  async getAndFormatData(
    flightsApiKey: string,
    weatherApiKey: string,
    iata: string,
  ): Promise<TransformedFlightData[]> {
    const flightService = new FlightService(flightsApiKey)
    const weatherService = new WeatherService(weatherApiKey)

    const formattedData: TransformedFlightData[] = []

    const allFlights: RawFlightData[] =
      await flightService.fetchFlightData(iata)

    for (const flight of allFlights) {
      const weatherData: RawWeatherData =
        await weatherService.fetchWeatherByIata(flight.arr_iata)

      formattedData.push({
        flightNumber: flight.flight_number,
        departureTime: flight.dep_time,
        destinationAirport: this.getAirportName(flight.arr_iata) || 'idk',
        destinationTemperature: weatherData.temp_c,
        condition: weatherData.condition,
        delay: flight.arr_delayed || undefined,
      })
    }

    return formattedData
  }

  async start() {
    const flightApiKey = process.env.FLIGHT_API_KEY
    const weatherApiKey = process.env.WEATHER_API_KEY

    if (flightApiKey === undefined || weatherApiKey === undefined) {
      throw new Error('API keys not found...')
    }

    this.printGreeting()
    const foundMatches = this.getMatches(await this.getUserInput())
    const matchingAirport = await this.getChoiceFromMatches(foundMatches)
    console.log(`Retrieving flight data for ${matchingAirport.name}`)
    const data = await this.getAndFormatData(
      flightApiKey,
      weatherApiKey,
      matchingAirport.iata,
    )
    console.log(data)
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
    const matches = this.loadedAirportData.filter((airport: Airport) => {
      if (airport.name !== null) {
        return airport.name.toLowerCase().includes(input)
      }
    })

    return matches
  }

  private getAirportName(iata: string): string | undefined {
    return this.loadedAirportData.find((airport) => airport.iata === iata)?.name
  }

  private createAirportSelection(airports: Airport[]) {
    return airports.map((airport: Airport) => ({
      name: airport.name,
      value: airport,
    }))
  }

  async getChoiceFromMatches(matches: Airport[]): Promise<Airport> {
    if (matches.length === 0) {
      throw new Error('Could not find any airports matching that name.')
    } else if (matches.length === 1) {
      return matches[0]
    } else {
      const selectedAirport = await select({
        message: 'Multiple airports found, please select one:',
        choices: this.createAirportSelection(matches),
      })
      return selectedAirport
    }
  }
}
