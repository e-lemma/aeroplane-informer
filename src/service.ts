import {
  RawFlightData,
  RawWeatherData,
  TransformedFlightData,
} from './interface.js'
import 'dotenv/config'
import axios from 'axios'

export class FlightService {
  private flights: TransformedFlightData[] = []
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

  async fetchWeatherByIata(iata: string): Promise<RawWeatherData> {
    try {
      const url = `${this.baseURL}${this.apiKey}&q=iata:${iata}%aqi=no`
      console.log(url)
      const response = await axios.get(url)
      const data = response.data.current

      return { temp_c: data.temp_c, condition: data.condition.text }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.error(`Could not get weather at iata: ${iata}`)
      } else {
        console.error(`Error fetching data: ${error}`)
      }
      throw new Error(`Error fetching weather data: ${error}`)
    }
  }
}
