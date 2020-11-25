// const moment = require('moment');
// const formatDuration = require('../../chat-utils/format-duration');
const Command = require('../command-interface');
const CommandOutput = require('../command-output');

async function embed(input, services) {
  let youtubeLiveVideoStatus;
  try {
    youtubeLiveVideoStatus = await services.embed.getActiveLiveBroadcastsVideoId();
  } catch (error) {
    services.logger.error('Could not get YouTube status', error);
  }
  
  if (!youtubeLiveVideoStatus.live) {
    return new CommandOutput(
      null,
      `${youtubeLiveVideoStatus.reason} check yourself at youtube.com/${services.embed.configuration.YOUTUBE_CHANNEL}`,
    );
  }
  return new CommandOutput(
    null,
    `#youtube/${youtubeLiveVideoStatus.videoId} click to switch the embed to YouTube.com/user/${services.embed.configuration.YOUTUBE_CHANNEL}`,
  );
}

module.exports = new Command(embed, true, false, null);
