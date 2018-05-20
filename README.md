# gatsby-source-lastfm

[![Build Status](https://travis-ci.org/jamesdanylik/gatsby-source-lastfm.svg?branch=master)](https://travis-ci.org/jamesdanylik/gatsby-source-lastfm)
[![npm package](https://img.shields.io/npm/v/gatsby-source-lastfm.svg)](https://www.npmjs.org/package/gatsby-source-lastfm)
[![npm package](https://img.shields.io/npm/dm/gatsby-source-lastfm.svg)](https://npmcharts.com/compare/gatsby-source-lastfm?minimal=true)

This is a source plugin for GatsbyJS to pull information from Last.FM.  It will pull in playbacks and associated information for a user into GraphQL, preserving all links as expected.  The plugin will grab up until the limit set in its configuration; if no limit is set, it will grab all a user's scrobbles.  Note that this could take a **LONG** time -- for 100,000 scrobbles, this equates to about 9 hours to build my site.  In short, including everything could make your build take all day.

## A Word on Tests
This plugin is setup for continuous deployment with Travis-CL for testing.  However, I'm still learning the proper way to unit tests GatsbyJS plugins, so my testing mainly focuses on the API side at the moment: we pull from the API, verify the structure hasn't changed, and verify that we parse correctly.  Currently, it is assumed that the GatsbyJS plugin structure hasn't changed; this isn't tested by the suite.

success source and transform nodes — 17794.957 s

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
          username: '<<USERNAME TO TRACK>>',
          limit: 200, // the maximum number of playbacks to pull in
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