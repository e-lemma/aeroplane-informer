import { FlightService, WeatherService } from '../src/service'
import axios from 'axios'
import { RawFlightData, RawWeatherData } from '../src/interface'

jest.mock('axios')
const mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>

describe('FlightService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const givenIata = 'LHR'
  const apiKey = 'test-api-key-123'
  const mockFlightData: RawFlightData[] = [
    {
      flight_number: 'BA123',
      dep_time: '2025-03-07 15:30',
      arr_iata: 'JFK',
      arr_delayed: '0',
    },
    {
      flight_number: 'BA456',
      dep_time: '2025-03-07 16:45',
      arr_iata: 'CDG',
      arr_delayed: '15',
    },
  ]

  describe('fetchFlightData', () => {
    test('should call the flight api and retrieve flight data using given iata', async () => {
      const flightService = new FlightService(apiKey)

      const mockResponse = {
        data: {
          response: mockFlightData,
        },
      }

      mockAxiosGet.mockResolvedValueOnce(mockResponse)
      const result = await flightService.fetchFlightData(givenIata)

      expect(mockAxiosGet).toHaveBeenCalledTimes(1)

      expect(mockAxiosGet).toHaveBeenCalledWith(
        `https://airlabs.co/api/v9/schedules?dep_iata=LHR&api_key=test-api-key-123`,
      )
      expect(result).toEqual([
        {
          flight_number: 'BA123',
          dep_time: '2025-03-07 15:30',
          arr_iata: 'JFK',
          arr_delayed: '0',
        },
        {
          flight_number: 'BA456',
          dep_time: '2025-03-07 16:45',
          arr_iata: 'CDG',
          arr_delayed: '15',
        },
      ])
    })

    test('should throw an error when API call fails', async () => {
      const givenIata = 'LHR'
      const flightService = new FlightService(apiKey)

      mockAxiosGet.mockRejectedValueOnce(new Error('API Error'))

      await expect(flightService.fetchFlightData(givenIata)).rejects.toThrow(
        'Error fetching flight data',
      )
    })
  })
})

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const givenIata = 'LHR'
  const apiKey = 'test-api-key-123'
  const mockWeatherData: RawWeatherData = {
    temp_c: '23',
    condition: 'sunny',
  }
  describe('fetchWeatherByIata', () => {
    test('should call the weather api and retrieve weather data using given iata', async () => {
      const weatherService = new WeatherService(apiKey)

      const mockResponse = {
        data: {
          current: {
            temp_c: '23',
            condition: {
              text: 'sunny',
            },
          },
        },
      }

      mockAxiosGet.mockResolvedValueOnce(mockResponse)
      const result = await weatherService.fetchWeatherByIata(givenIata)

      expect(mockAxiosGet).toHaveBeenCalledTimes(1)

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'http://api.weatherapi.com/v1/current.json?key=test-api-key-123&q=iata:LHR&aqi=no',
      )
      expect(result).toEqual(mockWeatherData)
    })

    test('should throw an error when API call fails', async () => {
      const weatherService = new WeatherService(apiKey)

      mockAxiosGet.mockRejectedValueOnce(new Error('API Error'))

      await expect(
        weatherService.fetchWeatherByIata(givenIata),
      ).rejects.toThrow('Error fetching weather data')
    })
  })
})
