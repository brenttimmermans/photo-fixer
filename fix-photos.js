const fs = require('fs-extra')
const path = require('path')
const exiftool = require("exiftool-vendored").exiftool
const { parse, format, addSeconds } = require('date-fns')
const flow = require('lodash.flow')
const compact = require('lodash.compact')
const last = require('lodash.last')
const padStart = require('lodash.padstart')
const pSeries = require('p-series')

async function fixPhotos (dir, rollNumber, dateString) {
	console.log('Starting fix photos')
	console.log('---')

	const outputDir = path.resolve(dir, rollNumber.toString())
	fs.removeSync(outputDir)

	console.log('Output directory cleaned')

	const files = readDirSync(dir)
	const sortedFiles = files.sort(sortFilesByIndex)

	const date = parseDate(dateString)

	console.log('---')
	console.log('Input:')
	console.log(`- directory: ${dir}`)
	console.log(`- rollNumber: ${rollNumber}`)
	console.log(`- date: ${dateString}`)
	console.log('---')

	console.log('Starting file fixing')

	const ops = sortedFiles.map((filename, index) => () => {
		const fileNumber = index + 1

		const input = path.resolve(dir, filename)
		const output = path.resolve(
			outputDir,
			createFilename(rollNumber, fileNumber)
		)

		fs.copySync(input, output)

		console.log(`Fixing: ${input}`)

		return exiftool.write(output, {
			AllDates: createFileTimestamp(date, fileNumber)
		}).then(() => {
			console.log(`Success: ${input} -> ${output}`)
			fs.removeSync(`${output}_original`)
		})
		.catch(() => {
			console.log(`Error: ${input}`)
		})
	})

	return pSeries(ops)
		.then(() => {
			console.log('Success: all files fixed')
			process.exit(0)
		})
		.catch(() => console.log('Error: not all files were fixed'))
}

/**
 * ==============
 * Read files
 * ==============
 */

// Get list of all non-hidden files in a directory
const readDirSync = dir => {
	return fs.readdirSync(dir)
		.filter(isNotHiddenFile)
}

const isNotHiddenFile = file => !file.startsWith('.')

/**
 * ==============
 * Sort files
 * ==============
 */

const sortFilesByIndex = (a, b) => getIndexFromName(a) - getIndexFromName(b)

/**
 * Filter for cleaning out all excessive characters in filename in
 * order to end up with the number (between 0 - 37) which is
 * sometimes led by one or multiple '_' and sometimes followed
 * by an 'A'
 *
 * [
 * 	'_7A_0325.jpg',
 * 	'_8_0324.jpg',
 * 	'__9A_0323.jpg',
 * 	'10A_0322.jpg',
 * 	'11_0321.jpg',
 * 	'12A_0320.jpg'
 * ]
 */
const getIndexFromName = name => flow(
	splitOnLodash,
	compact,
	last,
	parseInt
)(name)

const splitOnLodash = string => string.split('_')

/**
 * ==============
 * Date
 * ==============
 */

const parseDate = string => parse(string, 'dd/MM/yyyy', new Date())

/**
 * ==============
 * File naming
 * ==============
 */

const createFilename = (rollNumber, number) => {
	const formattedRollNumber = padStart(rollNumber, 3, 0)
	const formattedIndex = padStart(number, 4, 0)

	return `IMG_${formattedRollNumber}_${formattedIndex}.jpg`
}

const createFileTimestamp = (date, number) => {
	return format(
		addSeconds(date, number),
		'yyyy:MM:dd HH:mm:ss'
	)
}

module.exports = fixPhotos
