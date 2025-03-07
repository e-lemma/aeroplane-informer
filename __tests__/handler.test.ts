import { readFileSync, writeFileSync } from 'fs'
import { FileHandler } from '../src/handler'
import { Airport, TransformedFlightData } from '../src/interface'

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}))

const mockReadFileSync = readFileSync as jest.MockedFunction<
  typeof readFileSync
>
const mockWriteFileSync = writeFileSync as jest.MockedFunction<
  typeof writeFileSync
>

describe('FileHandler', () => {
  const mockAirportData: Airport[] = [
    {
      iata: 'LHR',
      lon: '-0.453566',
      iso: 'GB',
      status: 1,
      name: 'London Heathrow Airport',
      continent: 'EU',
      type: 'airport',
      lat: '51.469604',
      size: 'large',
    },
    {
      iata: 'SEN',
      lon: '0.701389',
      iso: 'GB',
      status: 1,
      name: 'Southend Airport',
      continent: 'EU',
      type: 'airport',
      lat: '51.572777',
      size: 'medium',
    },
    {
      iata: 'LYX',
      lon: '0.938414',
      iso: 'GB',
      status: 1,
      name: 'Lydd Airport',
      continent: 'EU',
      type: 'airport',
      lat: '50.955334',
      size: 'medium',
    },
    {
      iata: 'MSE',
      lon: '1.35',
      iso: 'GB',
      status: 1,
      name: 'Kent International Airport',
      continent: 'EU',
      type: 'airport',
      lat: '51.35',
      size: 'medium',
    },
    {
      iata: 'CAX',
      lon: '-2.809444',
      iso: 'GB',
      status: 1,
      name: 'Carlisle Airport',
      continent: 'EU',
      type: 'airport',
      lat: '54.93667',
      size: 'medium',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loadAirportData', () => {
    test('should return parsed airport data when file is read successfully', () => {
      mockReadFileSync.mockReturnValue(JSON.stringify(mockAirportData))
      const result = FileHandler.loadAirportData()

      expect(readFileSync).toHaveBeenCalledWith('./data/airports.json', 'utf-8')
      expect(result).toEqual(mockAirportData)
    })

    test('should throw an error when file reading fails', () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      expect(() => FileHandler.loadAirportData()).toThrow(
        'Could not read airports.json file',
      )
    })
  })

  describe('exportAsJSON', () => {
    test('should write data to a JSON file', () => {
      const mockData: TransformedFlightData[] = [
        {
          flightNumber: '5789',
          departureTime: '2025-03-07 11:55',
          destinationAirport: "Chicago O'Hare International Airport",
          destinationTemperature: '1.7',
          condition: 'Overcast',
        },
      ]

      const mockDate = new Date('2025-01-01T12:00:00Z')
      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => mockDate as unknown as Date)

      const consoleSpy = jest.spyOn(console, 'log')

      FileHandler.exportAsJSON(mockData)

      expect(writeFileSync).toHaveBeenCalledWith(
        `./data/exports/2025-01-01T12-00-00-000Z.json`,
        JSON.stringify(mockData, null, 2),
      )

      expect(consoleSpy).toHaveBeenCalledWith('Search saved!')
    })

    test('should throw an error when writing fails', () => {
      mockWriteFileSync.mockImplementation(() => {
        throw new Error('Write error')
      })

      expect(() => FileHandler.exportAsJSON([])).toThrow('Write error')
    })
  })
})
