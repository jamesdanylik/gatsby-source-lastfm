import createNodeHelpers from 'gatsby-node-helpers'

const {
	createNodeFactory,
	generateNodeId,
	generateTypeName,
} = createNodeHelpers({
	typePrefix: `Lastfm`,
})

// 

export const ARTIST_TYPE = `Artist`; // Artist is 1-> Many with Album, 1-> Many with Track 1-> Many with Playback
export const ALBUM_TYPE = `Album`; // Album is Many -> 1 with Artist, 1-> Many with track, 1-> 1 with Artist, 1-> Many with Playback
export const TRACK_TYPE = `Track`; // Track is Many -> 1 with Album, Artist, 1-> Many with Playback
export const PLAYBACK_TYPE = `Playback`; // Playback is Many -> 1 with Track
export const META_TYPE = `Meta`

export {generateNodeId}

export const ArtistNode = createNodeFactory(ARTIST_TYPE)

export const AlbumNode = createNodeFactory(ALBUM_TYPE)

export const TrackNode = createNodeFactory(TRACK_TYPE)

export const PlaybackNode = createNodeFactory(PLAYBACK_TYPE)

export const MetaNode = createNodeFactory(META_TYPE)
