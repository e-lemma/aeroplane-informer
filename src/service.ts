import { RawFlightData, RawWeatherData } from './interface.js'
import axios from 'axios'

export class FlightService {
  private readonly baseUrl = 'https://airlabs.co/api/v9/schedules?dep_iata='
  private readonly apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Could not retrieve Flight API key from .env')
    }
    this.apiKey = apiKey
  }

  async fetchFlightData(iata: string): Promise<RawFlightData[]> {
    try {
      const url = `${this.baseUrl}${iata}&api_key=${this.apiKey}`
      const response = await axios.get(url)
      const data: RawFlightData[] = response.data.response

      return data.map((flight) => {
        return {
          flight_number: flight.flight_number,
          dep_time: flight.dep_time,
          arr_iata: flight.arr_iata,
          arr_delayed: flight.arr_delayed,
        }
      })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.error(`Could not get flights from airport with iata: ${iata}`)
      } else {
        console.error(`Error fetching data: ${error}`)
      }
      throw new Error(`Error fetching flight data: ${error}`)
    }
  }
}

export class WeatherService {
  private readonly baseUrl = 'http://api.weatherapi.com/v1/current.json?key='
  private readonly apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Could not retrieve Weather API key from .env')
    }
    this.apiKey = apiKey
  }

  async fetchWeatherByIata(iata: string): Promise<RawWeatherData> {
    try {
      const url = `${this.baseUrl}${this.apiKey}&q=iata:${iata}&aqi=no`
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
