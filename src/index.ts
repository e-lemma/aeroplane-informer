import { AeroplaneSearcherCLI } from './cli.js'
import { FileHandler } from './handler.js'

const cli = new AeroplaneSearcherCLI(FileHandler.loadAirportData())
cli.start()
