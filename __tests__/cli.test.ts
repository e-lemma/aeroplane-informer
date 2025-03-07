import { AeroplaneSearcherCLI } from '../src/cli'
import { Airport } from '../src/interface'
import { select } from '@inquirer/prompts'

jest.mock('@inquirer/prompts', () => ({
  select: jest.fn(),
}))

const mockSelect = select as jest.MockedFunction<typeof select>

describe('AeroplaneSearcherCLI', () => {
  const testAirportData: Airport[] = [
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

  describe('getMatches', () => {
    test('should return airports matching the input', () => {
      const cli = new AeroplaneSearcherCLI(testAirportData)

      const matches: Airport[] = cli.getMatches('heathrow')

      expect(matches).toHaveLength(1)
      expect(matches[0].iata).toBe('LHR')
    })

    test('should return an empty array if no matches found', () => {
      const cli = new AeroplaneSearcherCLI(testAirportData)

      const matches: Airport[] = cli.getMatches('luton')

      expect(matches).toHaveLength(0)
      expect(matches).toEqual([])
    })
  })

  describe('getChoiceFromMatches', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should throw an error if no matches are found', async () => {
      const cli = new AeroplaneSearcherCLI(testAirportData)

      await expect(cli.getChoiceFromMatches([])).rejects.toThrow(
        'Could not find any airports matching that name.',
      )
    })

    test('should instantly return the the only match found', async () => {
      const cli = new AeroplaneSearcherCLI(testAirportData)
      const onlyMatch = testAirportData[0]

      const choice = await cli.getChoiceFromMatches([onlyMatch])

      expect(choice).toEqual(onlyMatch)
      expect(select).not.toHaveBeenCalled()
    })

    test('should prompt user to select when multiple matches are found', async () => {
      const cli = new AeroplaneSearcherCLI(testAirportData)

      const selectedAirport = testAirportData[2]

      mockSelect.mockResolvedValue(selectedAirport)

      const choice = await cli.getChoiceFromMatches(testAirportData)

      expect(select).toHaveBeenCalledWith({
        message: 'Multiple airports found, please select one:',
        choices: testAirportData.map((airport) => ({
          name: airport.name,
          value: airport,
        })),
      })

      expect(choice).toEqual(selectedAirport)
    })
  })
})
