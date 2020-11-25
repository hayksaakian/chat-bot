// scraper logic:
// 1. if we see this in the HTML it's probably live:
// {"text":" watching"}
// 2. find the first videoId we can, usually it's the one for the live stream

// const VIDEO_ID_REGEX = /videoId": "(.*?)"/mg
// spacing matters ^ the above regex failes because of the extra space.
const IS_LIVE_REGEX = /" watching"/mg
const VIDEO_ID_REGEX = /videoId":"(.*?)"/mg
let scraperapi = require('scraperapi-sdk')

class Embed {
  constructor(configuration) {
    this.configuration = configuration;
    this.scraperapiClient = scraperapi(this.configuration.SCRAPERAPI_KEY)
  }

  async getActiveLiveBroadcastsVideoId() {
    let URL = `https://www.youtube.com/user/${this.configuration.YOUTUBE_CHANNEL}`
    console.log("getting URL:", URL)
    try {
      let page_data = await this.scraperapiClient.get(URL, { country_code: 'US' })
      // console.log(page_data)

      // 1. confirm we're actually live first
      console.log('page_data')
      let is_live_matches = IS_LIVE_REGEX.exec(page_data)
      if (is_live_matches) {
        console.log(`${is_live_matches.length} is_live matches`)
        console.log('match0', is_live_matches[0])
        console.log('match1', is_live_matches[1])
        // this may need to be is_live_matches[1]
        // return is_live_matches[1]
      } else {
        console.log(`no is_live matches...`)
        return {
          live: false,
          videoId: null,
          reason: 'Likely offline'
        }
      }

      // 2. scrape the first videoId
      let video_id_matches = VIDEO_ID_REGEX.exec(page_data)
      if (video_id_matches) {
        console.log(`${video_id_matches.length} matches`)
        console.log('match0', video_id_matches[0])
        console.log('match1', video_id_matches[1])
        // this may need to be video_id_matches[1]
        return {
          live: true,
          videoId: video_id_matches[1]
        }
      } else {
        console.log(`no video_id_matches matches...`)
      }
    } catch (error) {
      console.log(error)
      return {
        live: false,
        videoId: null,
        reason: 'HTTP error probably a typo in the channel name or a nonexistant channel ID.'
      }
    }
    return {
      live: false,
      videoId: null,
      reason: 'Found a live flag but no video id -- maybe a bug in the regex'
    }
  }
}

module.exports = Embed;
