import { AeroplaneSearcherCLI } from './cli.js'
import { FileHandler } from './handler.js'
import 'dotenv/config'

const cli = new AeroplaneSearcherCLI(FileHandler.loadAirportData())
cli.start()
