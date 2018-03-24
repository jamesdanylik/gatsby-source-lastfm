import createNodeHelpers from 'gatsby-node-helpers'

const { createNodeFactory } = createNodeHelpers({
	typePrefix: `LastFM`
});

const RecentTrackNode = createNodeFactory('RecentTrack', node => {
	return node;
})

export { RecentTrackNode }