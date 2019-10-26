const fixPhotos = require('./index')
const path = require('path')

const DIR_PATH = path.resolve('/Users/brent/Downloads/542_1910181358')
const DATE = '01/10/2019'
const ROLL_NUMBER = 26

fixPhotos(DIR_PATH, ROLL_NUMBER, DATE)
