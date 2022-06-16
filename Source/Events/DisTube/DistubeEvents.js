const client = require("../../Structures/valiant");
const { MessageEmbed } = require("discord.js");

// <a:nitro:970844666327101473>
// <a:play:970141031569948752>
// <a:success:970141031569948752>

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
client.distube
  .on("playSong", (queue, song) =>
    queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setDescription(`<a:music:971880058660745288> | Playing \`${song.name}\` - \`${
              song.formattedDuration
            }\`\nRequested by: ${song.user}\n${status(queue)}`)]
    })
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send(
      new MessageEmbed()
        .setDescription(
          `<a:success:971880058371321877> | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
        )
        .setColor("GREEN")
    )
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel.send(
      new MessageEmbed()
        .setDescription(
          `<a:success:971880058371321877> | Added \`${
            playlist.name
          }\` playlist (${playlist.songs.length} songs) to queue\n${status(
            queue
          )}`
        )
        .setColor("GREEN")
    )
  )
  .on("error", (channel, e) => {
    channel.send(
      new MessageEmbed()
      .setDescription(      `<:fail:918314428301185056> | An error encountered: ${e
        .toString()
        .slice(0, 1974)}`)
        .setColor("RED")
    );
    console.error(e);
  })
  .on("empty", (channel) =>
    queue.textChannel.send(
      new MessageEmbed()
      .setDescription("Voice channel is empty! Leaving the channel...")
    )
  )
  .on("searchNoResult", (message, query) =>
    message.channel.send(
      new MessageEmbed()
      .setDescription(`<:fail:918314428301185056> | No result found for \`${query}\`!`)
    )
  )
  .on("finish", (queue) => queue.textChannel.send("Finished!"));
