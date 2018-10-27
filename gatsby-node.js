const crypto = require("crypto")
const fetch = require("node-fetch")
const queryString = require("query-string")

exports.sourceNodes = ({ actions, createNodeId}, configOptions) => {
	const { createNode } = actions

	delete configOptions.plugins

	// Take objects and create gatsby nodes as per spec
	const processNode = (node) => {
		// Removes id and typeName from target node, includes these as fields
		// in the generated gatsby node. Do cyrpto calculations to create
		// gatsby node as per spec.   
		const nodeId = node.id // from createNodeId
		const typeName = node.typeName // in PascalCase
		delete node.id
		delete node.typeName

		// Do required crypto calculation as per spec
		const nodeContent = JSON.stringify(node)
		const nodeContentDigest = crypto
			.createHash("md5")
			.update(nodeContent)
			.digest("hex")

		// Create a new gatsby node as per spec
		const nodeData = Object.assign({}, node, {
			id: nodeId,
			parent: null,
			children: [],
			internal: {
				type: typeName,
				content: nodeContent,
				contentDigest: nodeContentDigest
			}
		})

		return createNode(nodeData)
	}

	// Fetch from API and wait for results
	const apiFetch = async (url) => {
		return fetch(url)
			.then(response => {
				return response.json()
			})
	}

	const extractImages = (orig) => {
	  var trans = []
	  for( var index in orig) {
	    var item = {}
	    for( var key in orig[index] ) {
	      if (key === "#text") { item["text"] = orig[index][key] }
	      else { item[key] = orig[index][key] }
	    }
            trans.push(item)
	  }
	  return trans
	}

	// The actual plugin routine
	return new Promise( async (resolve, reject) => {
		var tracks = {}
		var artists = {}
		var albums = {}
		var playbacks = {}

		var pageNum = 1
		var reponse

		// Initial limit adjust to fit API requirements
		const numWanted = configOptions.limit
		if (configOptions.limit > 1000) {
			configOptions.limit = 1000
		}

	  while (Object.keys(playbacks).length < numWanted) {	

			// Get one page of API response, using configOptions + roundOptions
			const roundOptions = {
				method: "user.getrecenttracks",
				format: "json",
				extended: 1,
				page: pageNum
			}
			const pageOptions = Object.assign({}, configOptions, roundOptions) 
			const apiOptions = queryString.stringify(pageOptions)
			const apiUrl = `https://ws.audioscrobbler.com/2.0/?${apiOptions}`
			// Uncomment to show API requests in console
			// console.log(`\nFetch Last.FM ${pageNum}:\n\t${apiUrl}\n`)
			response = await apiFetch(apiUrl)
			
			// Check for a valid api response
			if(!response.hasOwnProperty('recenttracks')) {
				reject("Invalid response from Last.FM: no recenttracks property")
			}

			// Process recenttracks
			response.recenttracks.track.forEach(track => {
				// Skip tracks with no playback data; these are duplicates
				if(!track.date) {
					//console.log("Last.FM returned track with no playback data; usually safe to ignore")
					return
				}

				// For some reason, there isn't an album url given. This generally works
				const albumUrl = track.artist.url + '/' + encodeURIComponent(track.album['#text'].replace(/ /g, "+"))

				// Create relevant nodeIds for this playback
				const trackNodeId = createNodeId(`lastfm-track-${track.url}`)
				const artistNodeId = createNodeId(`lastfm-artist-${track.artist.url}`)
				const albumNodeId = createNodeId(`lastfm-album-${albumUrl}`)
				const playbackNodeId = createNodeId(`lastfm-playback-${track.date.uts}`)

				// Create or link:
				// Track Node
				if( !tracks[trackNodeId] ) {
					tracks[trackNodeId] = {
						id: trackNodeId,
						typeName: "LastfmTrack",
						name: track.name,
						loved: track.loved,
						mbid: track.mbid,
						streamable: track.streamable,
						url: track.url,
						image: extractImages(track.image),
						playbacks___NODE: [playbackNodeId],
						artist___NODE: artistNodeId,
						album___NODE: albumNodeId
					}
				} else {
					tracks[trackNodeId].playbacks___NODE.push(playbackNodeId)
				}

				// Artist Node
				if( !artists[artistNodeId] ) {
					artists[artistNodeId] = {
						id: artistNodeId,
						typeName: "LastfmArtist",
						name: track.artist.name,
						mbid: track.artist.mbid,
						url: track.artist.url,
						image: extractImages(track.artist.image),
						playbacks___NODE: [playbackNodeId],
						albums___NODE: [albumNodeId],
						tracks___NODE: [trackNodeId]
					}
				} else {
					artists[artistNodeId].playbacks___NODE.push(playbackNodeId)
					if(artists[artistNodeId].tracks___NODE.indexOf(trackNodeId) < 0) {
						artists[artistNodeId].tracks___NODE.push(trackNodeId)
					}
				}

				// Album Node
				if( !albums[albumNodeId] ) {
					const albumUrl = track.artist.url + '/' + encodeURIComponent(track.album['#text'].replace(/ /g, '+'))
					albums[albumNodeId] = {
						id: albumNodeId,
						typeName: "LastfmAlbum",
						name: track.album["#text"],
						mbid: track.album.mbid,
						url: albumUrl,
						playbacks___NODE: [playbackNodeId],
						artist___NODE: artistNodeId,
						tracks___NODE: [trackNodeId]
					}
				} else {
					albums[albumNodeId].playbacks___NODE.push(playbackNodeId)
					if(albums[albumNodeId].tracks___NODE.indexOf(trackNodeId) < 0) {
						albums[albumNodeId].tracks___NODE.push(trackNodeId)
					}
				}

				// Create Playback Node
				playbacks[playbackNodeId] = {
					id: playbackNodeId,
					typeName: "LastfmPlayback",
					date: track.date.uts,
					track___NODE: trackNodeId,
				}
			})

			// Respect API rate limiting
      const waitTill = new Date(new Date().getTime() + 500)
      while(waitTill > new Date()) {}

			// Ready parameters for next page
			pageNum += 1
		}

		// Done collecting nodes; time to pass them to GatsbyJS
		[tracks, albums, artists, playbacks].forEach(collection => {
			if( Array.isArray(collection) ) {
				collection.forEach(item => {
					processNode(item)
				})
			} else {
				for(var key in collection) {
					processNode(collection[key])
				}
			}
		})

		// Write meta node
		processNode({
    	id: createNodeId(`lastfm-meta-1`),
      typeName: "LastfmMeta",
		  total_playbacks: response.recenttracks["@attr"].total,
		  total_added: playbacks.length
   	})

		// We're done!
		resolve()
	})
}

