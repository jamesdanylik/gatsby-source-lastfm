import createNodeHelpers from 'gatsby-node-helpers'

const {
	createNodeFactory,
	generateNodeId,
	generateTypeName,
} = createNodeHelpers({
	typePrefix: `Lastfm`,
})


const LASTFM_TYPE = `Lastfm`
export const LastfmNode = createNodeFactory(LASTFM_TYPE, node => {
	return node
})