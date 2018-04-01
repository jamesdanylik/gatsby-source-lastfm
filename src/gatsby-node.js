import {RecentTrackNode} from './nodes'

exports.sourceNodes = async({boundActionCreators}) => {
	const { createNode } = boundActionCreators

	const recentTracks = [
		{id: 0, test: "stuff"},
		{id:1, test: "things"},
		{id:2, test: "also stuff"},
	]

	recentTracks.forEach(track => {
		const recentTrackNode = RecentTrackNode(track)
		createNode(recentTrackNode)
	})

	return
}