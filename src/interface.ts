export interface Flight {
  flightNumber: number
  departureTime: string
  destinationAirport: string
  destinationTemperature: number
  delay?: number
}

export interface Airport {
  Name?: string
  iata?: number
}
