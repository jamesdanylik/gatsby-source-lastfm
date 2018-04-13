import {
	recentTracksUrl,
	api,
	sourceNodes
} from "../gatsby-node.js"

test('always pass', () => {
	expect(1).toBe(1)
})


test('secure environment vairables', () => {
	expect(process.env.TESTAPIKEY).toEqual(expect.anything())
})

test('recentTracks endpoint contains "recenttracks" with "track" prop', async () => {
	const url = recentTracksUrl({
		api_key: process.env.TESTAPIKEY, 
		username: process.env.TESTUSERNAME, 
		extended: 1, 
		limit: 200
	})
	
	expect(api(url)).resolves.toHaveProperty("recenttracks")
	expect(api(url)).resolves.toHaveProperty("recenttracks.track")
})