# gatsby-source-lastfm

[![Build Status](https://travis-ci.org/jamesdanylik/gatsby-source-lastfm.svg?branch=master)](https://travis-ci.org/jamesdanylik/gatsby-source-lastfm)
[![npm package](https://img.shields.io/npm/v/gatsby-source-lastfm.svg)](https://www.npmjs.org/package/gatsby-source-lastfm)
[![npm package](https://img.shields.io/npm/dm/gatsby-source-lastfm.svg)](https://npmcharts.com/compare/gatsby-source-lastfm?minimal=true)

This is a source plugin for GatsbyJS to pull information from Last.FM.  Currently, the plugin grabs only the most recent 200 scrobbles for a single Last.fm user. Grabbing more / all scrobbles for a user is currently a work-in-progress; other features added by request.


## Install

```bash
npm install --save gatsby-source-lastfm
```


## Configuration
```javascript
// In your gatsby-config.js
plugins: [
	{
	      resolve: "gatsby-source-lastfm",
	      options: {
	        api_key: '<<YOUR API KEY HERE>>',
	        username: '<<USERNAME TO TRACK>>'
	      },
	},
	...
]
```

## Provided Queries

### Playbacks
```graphql
  allLastfmPlayback {
    edges {
      node {
        id
  		date {
  		  uts
  		  text
  		}
        track {
          id
          # linked track node here
          # (See track query for all fields)
        }
      }
    }
  }
```
### Tracks
```graphql
  allLastfmTrack {
    edges {
      node {
        id
        name
        loved
        mbid
        streamable
        url
        image {
          text
          size
        }
        artist {
          id
          # linked artist node here!
          # (See artist query for all fields)
        }
        album {
          id
          # linked album node here!
          # (See album query for all fields)
        }
        playbacks {
          id
          # linked playback nodes here!
          # (See playbacks query for all fields)
        }
      }
    }
  }
```

### Albums
```graphql
  allLastfmAlbum {
    edges {
      node {
        id
        name
        mbid
        playbacks {
          id
          # linked playback nodes here!
          # (See playbacks query for all fields)
        }
        artist {
          id
          # linked artist node here!
          # (See artist query for all fields)
        }
        tracks {
          id
          # linked track nodes here
          # (See track query for all fields)
        }
      }
    }
  }
```

### Artists
```graphql
  allLastfmArtist {
    edges {
      node {
        id
        name
        mbid
        image {
          text
          size
        }
        playbacks {
          id
          # linked playback nodes here!
          # (See playbacks query for all fields)
        }
        albums {
          id
          # linked album nodes here!
          # (See album query for all fields)
        }
        tracks {
          id
          # linked track nodes here
          # (See track query for all fields)
        }
      }
    }
  }
```

### Meta
```graphql
  allLastfmMeta {
    edges {
      node {
        id
        total_playbacks
      }
    }
  }
```