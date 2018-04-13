import {
	recentTracksUrl,
	api,
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

test('basic API response test', async () => {
	const url = recentTracksUrl({
		api_key: process.env.TESTAPIKEY, 
		username: process.env.TESTUSERNAME, 
		extended: 1, 
		limit: 200
	})
	
	expect(api(url)).resolves.toHaveProperty("recenttracks")
})