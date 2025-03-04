import { Flight } from './interface'
import 'dotenv/config'

export class FlightService {
  private flights: Flight[] = []
  private readonly baseUrl = 'https://airlabs.co/api/v9/schedules?dep_iata='
  private readonly apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Could not retrieve Flight API key from .env')
    }
    this.apiKey = apiKey
  }
}

export class WeatherService {
  private readonly baseURL = 'http://api.weatherapi.com/v1/current.json?key='
  private readonly apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Could not retrieve Weather API key from .env')
    }
    this.apiKey = apiKey
  }
}
