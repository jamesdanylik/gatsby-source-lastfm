import {RecentTrackNode} from './nodes'

exports.sourceNodes = async({boundActionCreators}) => {
	const { createNode } = boundActionCreators

	const recentTracks = [
		{test: "stuff"},
		{test: "things"},
		{test: "also stuff"},
	]

	recentTracks.forEach(track => {
		const recentTrackNode = RecentTrackNode(track)
		createNode(recentTrackNode)
	})

	return
}