import {
	PlaybackNode, 
	TrackNode, 
	ArtistNode,
	AlbumNode,
	MetaNode,
	generateNodeId, 
	TRACK_TYPE, 
	PLAYBACK_TYPE,
	ARTIST_TYPE,
	ALBUM_TYPE,
	META_TYPE
} from './nodes'
import fetch from 'isomorphic-fetch'

function api(url) {
	return fetch(url).then(results=> {
		return results.json()
	})
}

function recentTracksUrl(options) {
	var url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json'
	for( var property in options ) {
		url += '&' + property + '=' + options[property]
	}
	return url
}

function transformText(orig) {
	var trans = []
	for(var index in orig) {
		var item = {}
		for(var key in orig[index]) {
			if(key === "#text") {
				item['text'] = orig[index][key]
			} else {
				item[key] = orig[index][key]
			}
		}
		trans.push(item)
	}
	return trans
}

export {api, recentTracksUrl, transformText}

exports.sourceNodes = async({boundActionCreators}, {
	api_key,
	username,
	limit
}) => {
	const { createNode } = boundActionCreators

	//console.log('\nStarting LastFM Scrape...')
	//console.log('  api_key=' + api_key)
	//console.log('  username=' + username)

	var response = ''
	var fetchDone = false
	var currentPage = 1
	var tracks = {}
	var artists = {}
	var albums = {}
	var playbacks = []

	while(!fetchDone) {

		response = await api(recentTracksUrl({api_key: api_key, username: username, extended: 1, limit: 200, page: currentPage}))

		response.recenttracks.track.forEach(track => {
			if(track.date) {
				const albumUrl = track.artist.url + '/' + encodeURIComponent(track.album['#text'].replace(/ /g, '+'))
				// CHECK TRACK NODE
				if( tracks[generateNodeId(TRACK_TYPE, track.url)] ) {
					tracks[generateNodeId(TRACK_TYPE, track.url)].playbacks___NODE.push(generateNodeId(PLAYBACK_TYPE, track.date.uts))
				} else {
					var trackNode = TrackNode({
						id: track.url,
						name: track.name,
						loved: track.loved,
						mbid: track.mbid,
						streamable: track.streamable,
						url: track.url,
						image: transformText(track.image),
						playbacks___NODE: [generateNodeId(PLAYBACK_TYPE, track.date.uts)],
						artist___NODE: generateNodeId(ARTIST_TYPE, track.artist.url),
						album___NODE: generateNodeId(ALBUM_TYPE, albumUrl),
					})
					tracks[generateNodeId(TRACK_TYPE, track.url)] = trackNode
				}

				// CHECK ARTIST NODE
				if( artists[generateNodeId(ARTIST_TYPE, track.artist.url)]) {
					artists[generateNodeId(ARTIST_TYPE, track.artist.url)].playbacks___NODE.push(generateNodeId(PLAYBACK_TYPE, track.date.uts))
					// If track not linked to artist yet, link
					if(artists[generateNodeId(ARTIST_TYPE, track.artist.url)].tracks___NODE.indexOf(generateNodeId(TRACK_TYPE, track.url)) < 0) {
						artists[generateNodeId(ARTIST_TYPE, track.artist.url)].tracks___NODE.push(generateNodeId(TRACK_TYPE, track.url))
					}
				} else {
					var artistNode = ArtistNode({
						id: track.artist.url,
						name: track.artist.name,
						mbid: track.artist.mbid,
						image: transformText(track.artist.image),
						playbacks___NODE: [generateNodeId(PLAYBACK_TYPE, track.date.uts)],
						albums___NODE: [generateNodeId(ALBUM_TYPE, albumUrl)],
						tracks___NODE: [generateNodeId(TRACK_TYPE, track.url)]
					})
					artists[generateNodeId(ARTIST_TYPE, track.artist.url)] = artistNode
				}

				// CHECK ALBUM NODE
				if( albums[generateNodeId(ALBUM_TYPE, albumUrl)] ) {
					albums[generateNodeId(ALBUM_TYPE, albumUrl)].playbacks___NODE.push(generateNodeId(PLAYBACK_TYPE, track.date.uts))
					// if track not linked to album yet, link
					if(albums[generateNodeId(ALBUM_TYPE, albumUrl)].tracks___NODE.indexOf(generateNodeId(TRACK_TYPE, track.url)) < 0) {
						albums[generateNodeId(ALBUM_TYPE, albumUrl)].tracks___NODE.push(generateNodeId(TRACK_TYPE, track.url))
					}
				} else {
					var albumNode = AlbumNode({
						id: albumUrl,
						name: track.album['#text'],
						mbid: track.album.mbid,
						playbacks___NODE: [generateNodeId(PLAYBACK_TYPE, track.date.uts)],
						artist___NODE: generateNodeId(ARTIST_TYPE, track.artist.url),
						tracks___NODE: [generateNodeId(TRACK_TYPE, track.url)]
					})
					albums[generateNodeId(ALBUM_TYPE, albumUrl)] = albumNode
				}

				const playbackNode = PlaybackNode({
					id: track.date.uts, 
					date: transformText([track.date])[0],
					track___NODE: generateNodeId(TRACK_TYPE, track.url)
				})
				playbacks.push(playbackNode)
			}
		})

		//console.log(response.recenttracks['@attr'])
		if((response.recenttracks['@attr'].totalPages == currentPage) ||
			(currentPage * response.recenttracks['@attr'].perPage >= limit)) {
			fetchDone = true
			//console.log("Fetch Done")
		} else {
			currentPage = currentPage + 1
			//console.log("getting page " + currentPage)
			var waitTill = new Date(new Date().getTime() + 500)
			while(waitTill > new Date()) {}
		}
	}

	//console.log(Object.keys(tracks).length + " Tracks")
	for(var key in tracks) {
		createNode(tracks[key])
	}

	//console.log(Object.keys(albums).length + " Albums")
	for(var key in albums) {
		createNode(albums[key])
	}

	//console.log(Object.keys(artists).length + " Artists")
	for(var key in artists) {
		createNode(artists[key])
	}

	//console.log(playbacks.length + " Playbacks")
	playbacks.forEach(playback => {
		createNode(playback)
	})

	const metaNode = MetaNode({
		id: 0,
		total_playbacks: response.recenttracks['@attr'].total
	})
	createNode(metaNode)

	return
}