const { CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { generateChartConfig } = require('../../Structures/Functions/ChartJS/index');
const moment = require("moment");
const ms = require("ms");

module.exports = {
    name: "info",
    description: "Information based off the command options",
    options: [
        {
            name: "user",
            description: "Get The User Info",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "Select The User",
                    type: "USER",
                    userTypes: ["USER", "GUILD_MEMBER"],
                    required: true,
                },
            ]
        }, {
            name: "server",
            description: "Get The Server Info",
            type: "SUB_COMMAND",
            serverTypes: ["GUILD"],
        }, {
            name: "channel",
            description: "Get The Channel Info",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "Select The Channel",
                    type: "CHANNEL",
                    channelTypes: ['GUILD_TEXT', 'GUILD_VOICE', 'GUILD_NEWS'],
                    required: true,
                },
            ],
        }
    ],
    public: true,
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, data) {
        const { guild, options } = interaction;
 
        try {
            switch (options.getSubcommand()) {

                case "user": {

                    const Target = options.getMember("user");
                    await Target.fetch();

                    /**
                     * 
                     * @param {Target} Target 
                     */
                    async function displayHex(Target) {

                        if (Target.displayHexColor !== '#000000') {
                            return Target.displayHexColor;
                        } else {
                            return '#2F3136'; // Transparent
                        }

                    };

                    const Response = new MessageEmbed()
                    .setColor(await displayHex(Target))
                    .setAuthor({
                        name: `${Target.user.tag}'s Information`,
                        iconURL: Target.user.avatarURL({
                            dynamic: true,
                        }),
                    })
                    .setThumbnail(
                        `${Target.user.displayAvatarURL({
                            dynamic: true,
                            size: 1024,
                        })}`
                    )
                    .addFields({
                        name: "<:icon_reply:962547429914337300> GENERAL",
                        value: `

                        **\`•\` Name**: ${Target.user}
                        **\`•\` ID**: ${Target.user.id}
                        **\`•\` Roles**: ${Target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}
                        **\`•\` Joined Server**: <t:${parseInt(Target.joinedTimestamp / 1000)}:R>
                        **\`•\` Joined Discord**: <t:${parseInt(Target.user.createdTimestamp / 1000)}:R>
                        ㅤ
                        `,
                        inline: false,
                    })

                    interaction.reply({
                        embeds: [Response],
                        ephemeral: true,
                    });

                } break;


                case "server": {

                    const explicitFilter = {
                        DISABLED: 'Off',
                        MEMBERS_WITHOUT_ROLES: 'No Role',
                        ALL_MEMBERS: 'Everyone'
                    }

                    const verificationRate = {
                        NONE: 'None',
                        LOW: 'Low',
                        MEDIUM: 'Medium',
                        HIGH: 'High',
                        VERY_HIGH: 'Highest'
                    }

                    const Response = new MessageEmbed()
                    .setTitle(`Server Info:`)
                    .setColor("#5865F2")
                    .setThumbnail(guild.iconURL({dynamic: false, size: 1024}))
                    .addFields(
                        {
                            name: "<:icon_reply:962547429914337300> 📝 GENERAL:",
                            value: 
                            `

                            **\`•\` Name**: ${guild.name}
                            **\`•\` ID**: ${guild.id}
                            **\`•\` Created**: <t:${parseInt(guild.createdTimestamp / 1000)}:R>
                            **\`•\` Owner**: <@${guild.ownerId}>
                            **\`•\` Description**: ${guild.description || "None"}
                            **\`•\` Verification Rate**: ${verificationRate[guild.verificationLevel] || "None"}
                            **\`•\` Explicit Filter**: ${explicitFilter[guild.explicitContentFilter] || "None"}
                            ㅤ
                            `,
                            inline: true,

                        }, {
                            name: "<:icon_reply:962547429914337300> 👥 MEMBERS: ",
                            value:
                            `
                            **\`•\` Total Members**: ${guild.members.cache.size}
                            **\`•\` Users**: ${guild.members.cache.filter((m) => !m.user.bot).size}
                            **\`•\` Bots**: ${guild.members.cache.filter((m) => m.user.bot).size}
                            ㅤ
                            `,
                            inline: false,

                        }, {
                            name: "<:icon_reply:962547429914337300> 💬 CHANNELS: ",
                            value:
                            `
                            **\`•\` Total Channels**: ${guild.channels.cache.size}
                            **\`•\` Text**: ${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
                            **\`•\` Voice**: ${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
                            **\`•\` Threads**: ${guild.channels.cache.filter((c) => c.type === "GUILD_NEWS_THREAD" && "GUILD_PUBLIC_THREAD" && "GUILD_PRIVATE_THREAD").size}
                            **\`•\` Categories**: ${guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
                            **\`•\` Stages**: ${guild.channels.cache.filter((c) => c.type === "GUILD_STAGE_VOICE").size}
                            **\`•\` News**: ${guild.channels.cache.filter((c) => c.type === "GUILD_NEWS").size}
                            ㅤ
                            `,
                            inline: false,

                        },
                    )
                    .setFooter({ text: "Last Checked: "}).setTimestamp();
                    interaction.reply({
                        embeds: [Response],
                        ephemeral: true,
                    });
                } break;


                case "channel": {
                    
                    const channel = options.getChannel("channel");

                    const channelTypes = {
                        GUILD_TEXT: 'Text',
                        DM: 'DM',
                        GUILD_VOICE: 'Voice',
                        GROUP_DM: 'Group DM',
                        GUILD_CATEGORY: 'Category',
                        GUILD_NEWS: 'News/Announcement',
                        GUILD_NEWS_THREAD: 'News Thread',
                        GUILD_PUBLIC_THREAD: 'Public Thread',
                        GUILD_PRIVATE_THREAD: 'Private Thread',
                        GUILD_STAGE_VOICE: 'Stage Voice',
                        GUILD_DIRECTORY: 'Hub Directory',
                        GUILD_FORUM: 'Forum',
                    }

                    if (channel.type !== "GUILD_VOICE") {
                        const webhooks = await channel.fetchWebhooks();
                        const webhookArray = webhooks.size;

                        // Channel Message Analytics 
                        
                        const msgs = await channel.messages.fetch().then((res) => { return res });
                        const now = Date.now();

                        const last1Day = msgs.filter(
                            (msg) => now - msg.createdTimestamp < ms('1d')
                        ).size;

                        const last2Days = msgs.filter(
                            (msg) => now - msg.createdTimestamp < ms('2d')
                        ).size;

                        const last3Days = msgs.filter(
                            (msg) => now - msg.createdTimestamp < ms('3d')
                        ).size;

                        const last4Days = msgs.filter(
                            (msg) => now - msg.createdTimestamp < ms('4d')
                        ).size;

                        const last5Days = msgs.filter(
                            (msg) => now - msg.createdTimestamp < ms('5d')
                        ).size;

                        const last6Days = msgs.filter(
                            (msg) => now - msg.createdTimestamp < ms('6d')
                        ).size;

                        const last7Days = msgs.filter(
                            (msg) => now - msg.createdTimestamp < ms('7d')
                        ).size;


                        // Graph Data
                        const colors = {
                            purple: {
                                default: "rgba(149, 76, 233, 1)",
                                half: "rgba(149, 76, 233, 0.5)",
                                quarter: "rgba(149, 76, 233, 0.25)",
                                zero: "rgba(149, 76, 233, 0)"
                            },
                            indigo: {
                                default: "rgba(80, 102, 120, 1)",
                                quarter: "rgba(80, 102, 120, 0.25)"
                            }
                        };

                        const msgsData = [
                            last7Days,
                            last6Days,
                            last5Days,
                            last4Days,
                            last3Days,
                            last2Days,
                            last1Day,
                        ];
                        const labels = [
                            'Last Week',
                            'Last 6 Days',
                            'Last 5 Days',
                            'Last 4 Days',
                            'Last 3 Days',
                            'Last 2 Days',
                            'Last 1 Day',
                        ];

                        /**
                         * Generates a canvas for the chart
                         */
                        const canvas = new ChartJSNodeCanvas(
                            {
                                width: 1500,
                                height: 720,
                                plugins: {
                                    modern: [require('chartjs-plugin-gradient')],
                                },
                                chartCallback: (ChartJS) => { },
                            }
                        );

                        /**
                         * Generates chart configuration
                         */
                        const chartConfig = generateChartConfig(
                            {
                                type: "line",
                                data: {
                                    labels: labels,
                                    datasets: [
                                        {
                                            label: 'Messages',
                                            fill: true,
                                            gradient: {
                                                backgroundColor: {
                                                    axis: 'y',
                                                    colors: {
                                                        0: colors.purple.zero,
                                                        100: colors.purple.quarter,
                                                    },
                                                },
                                            },
                                            pointBackgroundColor: colors.purple.default,
                                            borderColor: colors.purple.default,
                                            data: msgsData,
                                            lineTension: 0.4,
                                            borderWidth: 2,
                                            pointRadius: 3
                                        },
                                    ],
                                },
                                options: {
                                    layout: {
                                        padding: 10
                                    },
                                    responsive: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    },
                                    scales: {
                                        xAxes: {
                                            gridLines: {
                                                display: false
                                            },
                                            ticks: {
                                                padding: 10,
                                                autoSkip: false,
                                                maxRotation: 0,
                                                minRotation: 0
                                            }
                                        },
                                        yAxes: {
                                            scaleLabel: {
                                                display: true,
                                                labelString: "Messages",
                                                padding: 10
                                            },
                                            gridLines: {
                                                display: true,
                                                color: colors.indigo.quarter
                                            },
                                            ticks: {
                                                beginAtZero: false,
                                                max: 63,
                                                min: 57,
                                                padding: 10
                                            }
                                        }
                                    }
                                },
                                plugins: [
                                    {
                                        id: 'mainBg',
                                        beforeDraw: (chart) => {
                                            const ctx = chart.canvas.getContext('2d');
                                            ctx.save();
                                            ctx.globalCompositeOperation = 'destination-over';
                                            ctx.fillStyle = '#192027';
                                            ctx.fillRect(0, 0, chart.width, chart.height);
                                            ctx.restore();
                                        }
                                    },
                                ],
                            }
                        )

                        const image = await canvas.renderToBuffer(chartConfig);
                        const attachment = new MessageAttachment(image, 'chart.png');

                        // Info Embed
                        const Response = new MessageEmbed()
                        .setColor(`#954CE9`) // ${colors.purple.default}
                        .setAuthor({
                            name: `${guild.name} | Channel Information`,
                            iconURL: guild.iconURL({
                                dynamic: true,
                                size: 512,
                            }),
                        })
                        .setTitle(`Channel Info:`)
                        .addFields({
                            name: "<:icon_reply:962547429914337300> GENERAL:",
                            value: 
                            `
                            **\`•\` Name**: ${channel}
                            **\`•\` Description**: ${channel.topic || "None"}
                            **\`•\` ID**: ${channel.id}
                            **\`•\` Category**: ${channel.parentId ? `${channel.parent.name}` : "None"}
                            **\`•\` Type**: ${channelTypes[channel.type] || "None"}
                            **\`•\` Position**: ${channel.position}
                            **\`•\` NSFW**: ${channel.nsfw ? "Yes" : "No"} 
                            **\`•\` Created**: <t:${parseInt(channel.createdTimestamp / 1000)}:R>
                            ㅤ
                            `
                        }, {
                            name: "<:icon_reply:962547429914337300> THREADS: ",
                            value: 
                            `
                            **\`•\` Active Threads**: ${channel.threads.cache.size || "None"}
                            ㅤ
                            `
                        }, {
                            name: "<:icon_reply:962547429914337300> WEBHOOKS: ",
                            value:
                            `
                            **\`•\` Total Webhooks**: ${ webhookArray || "None"}
                            ㅤ
                            `
                        })
                        .setImage('attachment://chart.png')
                            .setFooter({ text: "Last Checked: " }).setTimestamp();
                        
                        await interaction.deferReply();
                        await interaction.editReply({
                            embeds: [Response],
                            files: [attachment],
                        });

                    } else {

                        const vcmember = channel.members;
                        const memberArray = vcmember.size;

                        const Response = new MessageEmbed()
                        .setColor(`#5865F2`)
                        .setAuthor({
                            name: `${guild.name} | Channel Information`,
                            iconURL: guild.iconURL({
                                dynamic: true,
                                size: 512,
                            }),
                        })
                        .setTitle(`Channel Info:`)
                        .addFields({
                            name: "<:icon_reply:962547429914337300> GENERAL:",
                            value: 
                            `
                            **\`•\` Name**: ${channel.name}
                            **\`•\` Description**: ${channel.topic || "None"}
                            **\`•\` ID**: ${channel.id}
                            **\`•\` Category**: ${channel.parentId ? `${channel.parent.name}` : "None"}
                            **\`•\` Type**: ${channelTypes[channel.type] || "None"}
                            **\`•\` Position**: ${channel.position}
                            **\`•\` Created**: ${moment(channel.createdAt).format("MMMM Do YYYY")} (${moment(channel.createdAt).startOf("day").fromNow()})
                            ㅤ
                            `
                        }, {
                            name: "<:icon_reply:962547429914337300> VC: ",
                            value: 
                            `
                            **\`•\` Members**: ${memberArray || "None"}
                            **\`•\` Max Members**: ${channel.userLimit || "None"}
                            **\`•\` Bitrate**: ${channel.bitrate || "None"}
                            ㅤ
                            `
                        })
                        .setFooter({ text: "Last Checked: "}).setTimestamp();
                        interaction.reply({
                            embeds: [Response],
                            ephemeral: true,
                        });
                    }
                }
                break;
            };
        } catch (err) {
            console.log(err);
        };
    }
}