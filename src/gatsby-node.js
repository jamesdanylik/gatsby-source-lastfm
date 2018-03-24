const axios = require('axios');
import {RecentTrackNode} from './nodes';

function fetchRecentTracks(apikey, username, limit = 1, page = 1) {
	const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apikey}&format=json&limit=${limit}&page=${page}`;
	return axios.get(url);
}

function fetchLovedTracks(apikey, username, limit = 1, page = 1) {
	const url = `http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=${username}&api_key=${apikey}&format=json&limit=${limit}&page=${page}`;
	return axios.get(url);
}

exports.sourceNodes = async({ boundActionCreators }, {apiKey, username}) => {
	const { createNode } = boundActionCreators;

	console.log("Connecting to Last.FM...")

	try {
		const data = await fetchRecentTracks(apiKey, username);
		console.log("Got data...")
		data.recentracks.track.forEach((datum) => {
			const recentTrackNode = RecentTrackNode(datum);
			createNode(recentTrackNode);
			console.log("Created Node!");
		});

		console.log("Last.FM complete!")

		return;
	} catch(err) {
		console.error(err);
		process.exit(1);
	}
}