export interface RawFlightData {
  flight_number: string
  dep_time: string
  arr_iata: string
  arr_delayed: string | null
}

export interface RawWeatherData {
  temp_c: string
  condition: string
}

export interface TransformedFlightData {
  flightNumber: string
  departureTime: string
  destinationAirport: string
  destinationTemperature: string
  condition: string
  delay?: string
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
