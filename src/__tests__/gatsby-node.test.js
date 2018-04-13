import {
	sourceNodes
} from "../gatsby-node.js"

test('always pass', () => {
	expect(1).toBe(1)
})

test('sercure environment vairables', () => {
	expect(process.env.TESTVAR).teBe("TESTVAR")
})