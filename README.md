# gatsby-source-lastfm

This is a source plugin for GatsbyJS to pull information from Last.FM.  Currently, it is *not ready for use*; in fact, right now it ***DOESN'T WORK AT ALL***. this is my first gatsby source plugin and there is no real documentation on how to write a source plugin, so expect development to proceed accordingly.

## Usage ***NOT WORKING YET***

### gatsby-config.js
```javascript
plugins: [
	{
	      resolve: "gatsby-source-lastfm",
	      options: {
	        apiKey: '<<YOUR API KEY HERE>>',
	        username: '<<USERNAME TO TRACK>>'
	      },
	},
	...
]
```