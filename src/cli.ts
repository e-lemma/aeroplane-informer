import {
  RawFlightData,
  RawWeatherData,
  TransformedFlightData,
  Airport,
} from './interface.js'
import { FileHandler, ArgumentHandler } from './handler.js'
import { FlightService, WeatherService } from './service.js'
import { input, select } from '@inquirer/prompts'
import blessed from 'blessed'

export class AeroplaneSearcherCLI {
  constructor(private readonly airportData: Airport[]) {}

  async start() {
    const flightApiKey = process.env.FLIGHT_API_KEY
    const weatherApiKey = process.env.WEATHER_API_KEY

    if (flightApiKey === undefined || weatherApiKey === undefined) {
      throw new Error('API keys not found...')
    }

    this.printGreeting()

    let foundMatches: Airport[] = []

    while (foundMatches.length === 0) {
      const userInput = await this.getUserInput()
      foundMatches = this.getMatches(userInput)

      if (foundMatches.length === 0) {
        console.log('No matching airports found. Please try again.')
      }
    }

    const matchingAirport: Airport =
      await this.getChoiceFromMatches(foundMatches)

    console.log(`Retrieving flight data for ${matchingAirport.name}...`)

    const data: TransformedFlightData[] = await this.getAndFormatData(
      flightApiKey,
      weatherApiKey,
      matchingAirport.iata,
    )

    if (data.length > 0) {
      FileHandler.exportAsJSON(data)
      this.printTable(data)
    } else {
      console.log(
        `Could not find any flights departing from '${matchingAirport.name}'`,
      )
    }
  }

  printTable(flightData: TransformedFlightData[]) {
    const tableData = []

    tableData.push([
      'Flight Number',
      'Departure Time',
      'Destination Airport',
      'Destination Temperature',
      'Weather Condition',
      'Is Delayed?',
    ])

    flightData.forEach((flight: TransformedFlightData) => {
      let delayStatus
      if (flight.delay === undefined) {
        delayStatus = `{bold}{green-fg} On Time {/green-fg}{/bold}`
      } else {
        delayStatus = `{bold}{red-fg}${flight.delay} minutes{/red-fg}{/bold}`
      }

      const destinationAirportName =
        flight.destinationAirport === ''
          ? `{bold}{red-fg} Unable to retrieve airport name {/red-fg}{/bold}`
          : flight.destinationAirport

      tableData.push([
        flight.flightNumber,
        flight.departureTime,
        destinationAirportName,
        flight.destinationTemperature + ' °C',
        flight.condition,
        delayStatus,
      ])
    })

    const screen = blessed.screen({
      smartCSR: true,
      title: 'Departing Flights',
    })

    const table = blessed.listtable({
      parent: screen,
      width: '100%',
      height: '100%',
      tags: true,
      border: { type: 'line' },
      style: {
        border: { fg: 'cyan' },
        header: { bold: true, fg: 'yellow' },
        cell: { fg: 'white' },
        selected: { bg: 'blue' },
      },
      keys: true,
      vi: true,
      mouse: true,
      scrollable: true,
      data: tableData,
    })

    table.focus()
    screen.key(['q', 'escape'], () => process.exit(0))
    screen.render()
  }

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
        destinationAirport: this.getAirportName(flight.arr_iata) || '',
        destinationTemperature: weatherData.temp_c,
        condition: weatherData.condition,
        delay: flight.arr_delayed || undefined,
      })
    }

    return formattedData
  }

  printGreeting(): void {
    console.log('✈️✈️✈️ Welcome to the aeroplane searcher! ✈️✈️✈️')
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
    const matches = this.airportData.filter((airport: Airport) => {
      if (airport.name !== null) {
        return airport.name.toLowerCase().includes(input)
      }
    })

    return matches
  }

  private getAirportName(iata: string): string | undefined {
    const airport = this.airportData.find((airport) => airport.iata === iata)
    return airport ? airport.name : undefined
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
