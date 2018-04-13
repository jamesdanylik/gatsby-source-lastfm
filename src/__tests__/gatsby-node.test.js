import {
	sourceNodes
} from "../gatsby-node.js"

test('always pass', () => {
	expect(1).toBe(1)
})

//TESTAPIKEY
//TESTUSERNAME

test('sercure environment vairables', () => {
	expect(process.env.TESTVAR).toBe("TESTVAR")
})

test('basic API response test', () => {
	const response = await api(recentTracksUrl({
		api_key: process.env.TESTAPIKEY, 
		username: process.env.TESTUSERNAME, 
		extended: 1, 
		limit: 200
	}))
	expect(response.hasOwnProperty('recenttracks')).toBe(true)
	expect(response.recenttracks.hasOwnProperty('track')).toBe(true)
}