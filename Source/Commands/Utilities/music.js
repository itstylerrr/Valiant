const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const util = require("../../utils/util");
const genius = require("genius-lyrics");
const gClient = new genius.Client();

module.exports = {
    name: "music",
    description: "A complete music system",
    public: true,
    options: [
        {
            name: "play",
            description: "Plays a song.",
            type: "SUB_COMMAND",
            options: [{ name: "query", description: "Provide the name of the song or URL.", type: "STRING", required: true }]
        },
        {
            name: "volume",
            description: "Alter the volume.",
            type: "SUB_COMMAND",
            options: [{ name: "percent", description: "10 = 10%", type: "NUMBER", required: true }]
        },
        {
            name: "settings",
            description: "Select an option.",
            type: "SUB_COMMAND",
            options: [{
                name: "options", description: "Select an option.", type: "STRING", required: true,
                choices: [
                    { name: "🔹| View Queue", value: "queue" },
                    { name: "🔹| Skip", value: "skip" },
                    { name: "🔹| Pause", value: "pause" },
                    { name: "🔹| Resume", value: "resume" },
                    { name: "🔹| Stop", value: "stop" },
                    { name: "🔹| Lyrics", value: "lyrics"},
                    { name: "🔹| Shuffle", value: "shuffle" },
                    { name: "🔹| Now Playing", value: "nowplaying" },
                ]
            }],
        }
    ],
    /**
    * @param {CommandInteraction} interaction 
    * @param {Client} client 
    */
    async execute(interaction, client) {
        // return interaction.reply({content: "**Music system down**"});
        const { options, member, guild } = interaction;
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel)
            return interaction.reply({ content: "You aren't in a voice channel. Join one to be able to play music!", ephemeral: true });

        if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({ content: `I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true });

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true
        });

        let res;
        try {
            switch (options.getSubcommand()) {
                case "play": {
                    const query = interaction.options.getString("query");
                    res = await player.search(query, interaction.user.username);

                    if (res.loadType === "LOAD_FAILED") {
                        if (!player.queue.current) player.destroy();
                        return interaction.reply({ content: "🔹 | An error has occured while trying to add this song." })
                    }

                    if (res.loadType === "NO_MATCHES") {
                        if (!player.queue.current) player.destroy();
                        return interaction.reply({ content: "🔹 | No results found." })
                    }

                    if (res.loadType === "PLAYLIST_LOADED") {
                        player.connect();
                        player.queue.add(res.tracks);
                        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                        const playlistEmbed = new MessageEmbed()
                            .setDescription(`🔹 | **[${res.playlist.name}](${query})** has been added to the queue.`)
                            .addField("Enqueued", `\`${res.tracks.length}\` tracks`)
                        return interaction.reply({ embeds: [playlistEmbed] })
                    }

                    if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
                        player.connect();
                        player.queue.add(res.tracks[0]);
                    }

                    const enqueueEmbed = new MessageEmbed()
                        .setColor("BLURPLE")
                        .setDescription(`Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${member}]`)
                    await interaction.reply({ embeds: [enqueueEmbed] });

                    if (!player.playing && !player.paused && !player.queue.size) player.play()

                    if (player.queue.totalSize > 1)
                        enqueueEmbed.addField("Position in queue", `${player.queue.size - 0}`);
                    return interaction.editReply({ embeds: [enqueueEmbed] })
                }
                case "volume": {
                    const volume = options.getNumber("percent");
                    if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." })
                    if (volume < 0 || volume > 100) return interaction.reply({ content: `You can only set the volume from 0 to 100.` })
                    player.setVolume(volume);

                    const volumeEmbed = new MessageEmbed()
                        .setColor("BLURPLE")
                        .setDescription(`🔹 | Volume has been set to **${player.volume}%**.`)
                    return interaction.reply({ embeds: [volumeEmbed] })
                }
                case "settings": {
                    switch (options.getString("options")) {
                        case "skip": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." })
                            await player.stop();

                            const skipEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setDescription(`🔹 | Skipped.`)

                            return interaction.reply({ embeds: [skipEmbed] });
                        }
                        case "nowplaying": {
                            const track = player.queue.current;

                            const npEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle("Now Playing")
                                .setDescription(`[${track.title}](${track.uri}) [${player.queue.current.requester}]`)
                            return interaction.reply({ embeds: [npEmbed] })
                        }
                        case "pause": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." })

                            await player.pause(true);

                            const pauseEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setDescription("🔹 | Paused.")
                            return interaction.reply({ embeds: [pauseEmbed] })
                        }
                        case "resume": {
                            await player.pause(false);

                            const resumeEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setDescription("🔹 | Resumed.")
                            return interaction.reply({ embeds: [resumeEmbed] })
                        }
                        case "stop": {
                            player.destroy()

                            const disconnectEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setDescription("🔹 | Disconnected.")
                            return interaction.reply({ embeds: [disconnectEmbed] })
                        }
                        case "lyrics": {
                            const track = player.queue.current;
                            const trackTitle = track.title.replace("(Official Video)", "").replace("(Official Audio)", "");              
                            const actualTrack = await gClient.songs.search(trackTitle);
                            const searches = actualTrack[0];
                            const lyrics = await searches.lyrics();

                            const lyricsEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`🔹 | Lyrics for **${trackTitle}**`)
                                .setDescription(lyrics)
                            return interaction.reply({ embeds: [lyricsEmbed] })     
                        }
                        case "shuffle": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." });
                            if (!player.queue.length) return interaction.reply({ content: "There is nothing in the queue." });

                            player.queue.shuffle()

                            const shuffleEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setDescription("🔹 | Shuffled the queue.")
                            return interaction.reply({ embeds: [shuffleEmbed] })
                        }
                        case "queue": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." });
                            if (!player.queue.length) return interaction.reply({ content: "There is nothing in the queue." });

                            const queue = player.queue.map((t, i) => `\`${++i}.\` **${t.title}** [${t.requester}]`);
                            const chunked = util.chunk(queue, 10).map(x => x.join("\n"));

                            const queueEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`Current queue for ${guild.name}`)
                                .setDescription(chunked[0])

                            return interaction.reply({ embeds: [queueEmbed] });
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}