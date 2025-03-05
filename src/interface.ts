export interface RawFlightData {
  flight_number: string
  departure_time: string
  destination_iata: string
  arr_delayed: number | null
}

export interface RawWeatherData {
  temp_c: any
  condition: string
}

export interface TransformedFlightData {
  flightNumber: number
  departureTime: string
  destinationAirport: string
  destinationTemperature: number
  delay?: number
}

export interface Airport {
  name: string
  iata: number
}
