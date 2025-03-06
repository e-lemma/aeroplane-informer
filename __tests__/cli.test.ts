import { AeroplaneSearcherCLI } from '../src/cli'
import { Airport } from '../src/interface'

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
  ]

  const cli = new AeroplaneSearcherCLI(testAirportData)

  test('getMatches should return airports matching the input', () => {
    const matches = cli.getMatches('heathrow')

    expect(matches).toHaveLength(1)
    expect(matches[0].iata).toBe('LHR')
  })
})
