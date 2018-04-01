import createNodeHelpers from 'gatsby-node-helpers'

const {
	createNodeFactory,
	generateNodeId,
	generateTypeName,
} = createNodeHelpers({
	typePrefix: `Lastfm`,
})


const RECENTTRACK_TYPE = `Recenttrack`
export const RecentTrackNode = createNodeFactory(RECENTTRACK_TYPE, node => {
	return node
})