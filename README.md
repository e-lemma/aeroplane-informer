# Aeroplane Informer

A command-line tool that allows you to search and view departures from airports around the world. This application retrieves real-time flight schedules and destination weather data.

## Features

- Search for airports by name
- Get real-time departure information
- View weather conditions at destination airports
- Color-coded flight status for delays
- Interactive terminal UI
- Search results automatically exported to JSON

## API Keys

This application requires API keys from two services:

- **Flight data**: Register for an API key at [AirLabs](https://airlabs.co/)
- **Weather data**: Register for an API key at [WeatherAPI](https://www.weatherapi.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/e-lemma/aeroplane-informer.git
   cd aeroplane-informer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the application:

   ```bash
   npm run build
   ```

4. Create a `.env` file in the root directory with your API keys:

   ```bash
   FLIGHT_API_KEY=your_flight_api_key
   WEATHER_API_KEY=your_weather_api_key
   ```

## Usage

### Using Command Line Arguments

```bash
npm start -- -a "Heathrow"
```

or

```bash
node dist/index.js -a "Heathrow"
```

### Interactive Mode

Simply run the application without any arguments:

```bash
npm start
```

Follow the prompts to search for an airport.

## Development

- Run tests: `npm test`
- Run linter: `npm run lint`
- Watch for changes during development: `npm run dev`

## Technologies

- TypeScript
- Commander.js for CLI argument parsing
- Inquirer.js for interactive prompts
- Blessed for terminal UI
- Axios for API requests
- Jest for testing
