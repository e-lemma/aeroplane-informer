export interface RawFlightData {
  flight_number: string
  dep_time: string
  arr_iata: string
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
  iata: string
  lon: string
  iso: string
  status: number
  name: string
  continent: string
  type: string
  lat: string
  size: string
}
