const fixPhotos = require('./index')
const path = require('path')

const DIR_PATH = path.resolve('/Users/user/Pictures/some-folder-with-scans')
const DATE = '01/01/2020'
const ROLL_NUMBER = 26

fixPhotos(DIR_PATH, ROLL_NUMBER, DATE)
