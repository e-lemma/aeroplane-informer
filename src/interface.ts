export interface RawFlightData {
  flight_number: string
  departure_time: string
  destination_iata: string
  arr_delayed: number | null
}

export interface RawWeatherData {
  temp_c: string
  condition: string
}

export interface TransformedFlightData {
  flightNumber: number
  departureTime: string
  destinationAirport: string
  destinationTemperature: number
  condition: string
  delay?: number
}

export interface Airport {
  name: string
  iata: number
}
