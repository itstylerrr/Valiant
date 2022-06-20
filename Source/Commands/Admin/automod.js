const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const DB = require('../../Structures/Database/Schemas/ModerationDB');

module.exports = {
    name: "automod",
    description: "AI Assisted Moderation Setup.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'add',
            description: 'Add Channel For Automod',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "channel",
                    description: "The Channel For Automod",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true,
                },
            ],
        }, {
            name: 'remove',
            description: 'Remove Channel For Automod',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "channel",
                    description: "The Channel For Automod",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true,
                },
            ],
        }, {
            name: 'list',
            description: 'Show All Automod Settings',
            type: 'SUB_COMMAND',
        }, {
            name: 'log',
            description: 'Set Logging Channel For Automod',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'add',
                    description: 'Add Log Channel For Automod',
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: false,
                }, {
                    name: 'remove',
                    description: 'Remove Log Channel For Automod',
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: false,
                },
            ],
        }, {
            name: 'punishments',
            description: 'Configure Automod Punishments',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'low',
                    description: 'Set Low Severity Punishment',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'Delete',
                            value: 'delete',
                        }, {
                            name: 'Timeout',
                            value: 'timeout',
                        }, {
                            name: 'Kick',
                            value: 'kick',
                        }, {
                            name: 'Ban',
                            value: 'ban',
                        }, 
                    ],
                }, {
                    name: 'medium',
                    description: 'Set Medium Severity Punishment',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'Delete',
                            value: 'delete',
                        }, {
                            name: 'Timeout',
                            value: 'timeout',
                        }, {
                            name: 'Kick',
                            value: 'kick',
                        }, {
                            name: 'Ban',
                            value: 'ban',
                        }, 
                    ],
                }, {
                    name: 'high',
                    description: 'Set High Severity Punishment',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'Delete',
                            value: 'delete',
                        }, {
                            name: 'Timeout',
                            value: 'timeout',
                        }, {
                            name: 'Kick',
                            value: 'kick',
                        }, {
                            name: 'Ban',
                            value: 'ban',
                        }, 
                    ],
                }, 
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client, data) {
        const { options, guild, channel, } = interaction;

        switch (options.getSubcommand()) {
            case "add": {
                const channel = options.getChannel("channel");

                DB.findOne({
                    GuildID: guild.id
                }, async (err, docs) => {
                    if (err) throw err;

                    if (!docs) {
                        await DB.create({
                            GuildID: guild.id,
                            ChannelIDs: channel.id,
                        })
                    } else if (docs) {
                        if (docs.ChannelIDs.includes(channel.id)) {
                            return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(
                                        `${channel} Is Already In The Automod Channels`
                                    )
                                ],
                                ephemeral: true,
                            })
                        }
    
                        docs.ChannelIDs.push(channel.id);
                        await docs.save();
                    }

                    await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`${channel} Has Been Added to the Automod Channels`)
                        ],
                        ephemeral: true,
                    })
                })

            } break;


            case "remove": {
                const channel = options.getChannel("channel");

                DB.findOne({
                    GuildID: guild.id
                }, async (err, docs) => {
                    if (err) throw err;

                    if (!docs || !docs.ChannelIDs[0]) {
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                .setColor("RED")
                                .setTitle("🛑 Automod Not Configured!")
                                .setDescription(
                                    `Please Configure Automod First
                                    Use \`/automod add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod
                                    `
                                )
                            ],
                            ephemeral: true,
                        })

                    } else if (docs) {

                        if (!docs.ChannelIDs.includes(channel.id)) {
                            return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(
                                        `${channel} Is Not in the Automod Channels`
                                    )
                                ],
                                ephemeral: true,
                            })
                        }
                    }

                    docs.ChannelIDs.remove(channel.id);
                    await docs.save();

                    await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`${channel} Has Been Removed to the Automod Channels`)
                        ],
                        ephemeral: true,
                    })
                })

            } break;


            case "list": {

                const ChannelIDs = [];
                const LogChannelIDs = [];

                DB.findOne({
                    GuildID: guild.id
                }, async(err, docs) =>{
                    if(err) throw err;

                    if(!docs || !docs.ChannelIDs[0]) {
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                .setColor("RED")
                                .setTitle("🛑 Automod Not Configured!")
                                .setDescription(
                                    `Please Configure Automod First
                                    Use \`/automod add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod
                                    `
                                )
                            ],
                            ephemeral: true,
                        })
                    }

                    await docs.ChannelIDs.forEach(async(c) => {
                        const channel = await client.channels.fetch(c);
                        ChannelIDs.push(channel);
                    });

                    await docs.LogChannelIDs.forEach(async(c) => {
                        const channel = await client.channels.fetch(c);
                        LogChannelIDs.push(channel);
                    });

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle(`Automod Configuration`)
                            .addFields({
                                name: '<:icon_reply:962547429914337300> Channels',
                                value: `${ChannelIDs.join("\n") || "Not Provided Yet"}
                                ㅤ
                                `,
                                inline: false,
                            }, {
                                name: '<:icon_reply:962547429914337300> Punishments',
                                value: `\`•\` Low Severity: ${docs.Punishments[0] || 'Not Provided Yet'}
                                \`•\` Medium Severity: ${docs.Punishments[1] || 'Not Provided Yet'}
                                \`•\` High Severity: ${docs.Punishments[2] || 'Not Provided Yet'}
                                ㅤ
                                `,
                                inline: false,
                            }, {
                                name: '<:icon_reply:962547429914337300> Logging Channels',
                                value: `${LogChannelIDs.join("\n") || "Not Provided Yet"}
                                ㅤ
                                `,
                                inline: false,
                            })
                        ],
                        ephemeral: true,
                    });
                })

            } break;


            case 'log': {
                const addChannel = options.getChannel("add");
                const removeChannel = options.getChannel("remove");

                // A Function To Remove Single Value From Array
                function removeOne(arr, value) {
                    var index = arr.indexOf(value);
                    if (index > -1) {
                      arr.splice(index, 1);
                    }
                    return arr;
                }

                if (addChannel) {
                    DB.findOne({
                        GuildID: guild.id
                    }, async (err, docs) => {
                        if (err) throw err;

                        if (!docs) {
                            await DB.create({
                                GuildID: guild.id,
                                LogChannelIDs: addChannel.id,
                            })
                        } else if (docs) {
                            if (docs.LogChannelIDs.includes(addChannel.id)) {
                                return interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            `${addChannel} Is Already In The Automod Logging Channels`
                                        )
                                    ],
                                    ephemeral: true,
                                })
                            }

                            docs.LogChannelIDs.push(addChannel.id);
                            await docs.save();
                        }

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`${addChannel} Has Been Added to the Automod Logging Channels`)
                            ],
                            ephemeral: true,
                        });
                    })

                } else if (removeChannel) {
                    DB.findOne({
                        GuildID: guild.id
                    }, async (err, docs) => {
                        if (err) throw err;

                        if (!docs || !docs.LogChannelIDs[0]) {
                            return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setColor("RED")
                                    .setTitle("🛑 Automod Not Configured!")
                                    .setDescription(
                                        `Please Configure Automod First
                                Use \`/automod add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod
                                `
                                    )
                                ],
                                ephemeral: true,
                            })

                        } else if (docs) {

                            if (!docs.LogChannelIDs.includes(removeChannel.id)) {
                                return interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            `${removeChannel} Is Not in the Automod Logging Channels`
                                        )
                                    ],
                                    ephemeral: true,
                                })
                            }
                        }

                        docs.LogChannelIDs = removeOne(docs.LogChannelIDs, removeChannel.id);
                        await docs.save();

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`${removeChannel} Has Been Removed to the Automod Logging Channels`)
                            ],
                            ephemeral: true,
                        });
                    })
                }
            } break;


            case "punishments": {
                const low = options.getString("low");
                const medium = options.getString("medium");
                const high = options.getString("high");

                const docs = await DB.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Punishments: [
                        low,
                        medium,
                        high,
                    ],
                }, {
                    new: true,
                    upsert: true,
                });

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle(`Automod Punishments`)
                        .setDescription(
                            `**Low Severity**: ${docs.Punishments[0]}
                            **Medium Severity**: ${docs.Punishments[1]}
                            **High Severity**: ${docs.Punishments[2]}
                            `
                        )
                    ],
                    ephemeral: true,
                });
            } break;
        }
    }
}
