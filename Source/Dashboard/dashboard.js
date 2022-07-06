function init(client) {
    const { dashboard, mongoURI } = require('../../Configs/main.json');
    const DarkDashboard = require('dbd-dark-dashboard');
    const DBD = require("discord-dashboard");
    const mongoose = require("mongoose");
    const guildSchema = require("../Structures/Database/Schemas/Guild");
    const automodSchema = require('../Structures/Database/Schemas/ModerationDB');
    const loggingSchema = require("../Structures/Database/Schemas/Logging");

    const totalUsers = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    const usersWord = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
        ? "users"
        : "user";
    const totalGuilds = client.guilds.cache.size;
    const guildsWord = client.guilds.cache.size > 1 ? "servers" : "server";

    /* --- DASHBOARD --- */
    (async () => {
        let DBD = require('discord-dashboard');
        await DBD.useLicense(dashboard.dbd_lic);
        DBD.Dashboard = DBD.UpdatedClass();

        const Dashboard = new DBD.Dashboard({
            port: 80,
            client: {
                id: dashboard.client_id,
                secret: dashboard.client_secret
            },
            redirectUri: dashboard.redirect_uri,
            domain: 'http://localhost',
            bot: client,
            theme: DarkDashboard({
                information: {
                    createdBy: "Greezy Development",
                    websiteTitle: "Valiant",
                    websiteName: "Valiant",
                    websiteUrl: "http://localhost",
                    dashboardUrl: "http://localhost:3000/",
                    supporteMail: "support@greezy.tk",
                    supportServer: "https://discord.gg/a7V6C4dAQj",
                    imageFavicon: "https://docs.google.com/drawings/d/e/2PACX-1vSnKAiuOYUjIz30bN85bJiaHrZ31dx0qvgxDY840hg02UlxCAzPIMxMFKETwrb9B1sYVnav2wzqr_gJ/pub?w=304&h=311",
                    iconURL: "https://docs.google.com/drawings/d/e/2PACX-1vSnKAiuOYUjIz30bN85bJiaHrZ31dx0qvgxDY840hg02UlxCAzPIMxMFKETwrb9B1sYVnav2wzqr_gJ/pub?w=304&h=311",
                    loggedIn: "Successfully signed in.",
                    mainColor: "#1e54ac",
                    subColor: "#739de0",
                    preloader: "Loading..."
                },

                invite: {
                    clientId: "990376052813615115",
                    permissions: '8',
                    redirectUri: "http://localhost/discord/callback",
                    scopes: ["bot", "application.commands", "guilds"],
                },

                index: {
                    card: {
                        category: "Valiant's Panel - The center of everything",
                        title: `Welcome to Valiant... A multipurpose discord bot that can do whatever you dream of, execpt *bake you a cake*...`,
                        image: "https://docs.google.com/drawings/d/e/2PACX-1vS2QIenk9jw5iT_thON1kA8rLl-rX_OUFYlp0yKFc_f_wxw1wn1tMW7T_8eKI5WAtqAlw9_Cjf-166m/pub?w=927&h=178",
                        footer: "To get started, just sign in using your discord account!",
                    },

                    information: {
                        category: "Bot Information",
                        title: "Information",
                        description: `Valiant is trusted by many users and guilds. We have a total of ${totalUsers} ${usersWord} throughout ${totalGuilds} ${guildsWord}.`,
                        footer: "To invite the bot, just log in and select a server you want the bot to join!",
                    },

                    feeds: {
                        category: "Category",
                        title: "Information",
                        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                        footer: "Footer",
                    },
                },

                commands: [
                    {
                        category: `Starting Up`,
                        subTitle: `All helpful commands`,
                        list: [{
                            commandName: 'automod',
                            commandUsage: `/automod [options]`,
                            commandDescription: `Configure the settings for the automod system, also configurable in the dashboard.`,
                            commandAlias: 'No aliases'
                        },
                        {
                            commandName: "chatbot",
                            commandUsage: "/chatbot [channel]",
                            commandDescription: "Choose the channel in which the chatbot will interact in, also configurable in the dashboard.",
                            commandAlias: "No aliases",
                        },
                        {
                            commandName: "goodbye",
                            commandUsage: "/goodbye [options]",
                            commandDescription: "Configure the settings for what the bot should do when a member joins, also configurable in the dashboard.",
                            commandAlias: "No aliases",
                        },
                        {
                            commandName: "logging",
                            commandUsage: "/logging [options]",
                            commandDescription: "Configure the logging channels for different logging types, also configurable in the dashboard.",
                            commandAlias: "No aliases",
                        },
                        {
                            commandName: "ticketsetup",
                            commandUsage: "/ticketsetup [options]",
                            commandDescription: "Setup the ticket buttons and messages, also configureable in the dashboard.",
                            commandAlias: "No aliases",
                        },
                        {
                            commandName: "welcome",
                            commandUsage: "/welcome [options]",
                            commandDescription: "Configure the settings for what the bot should do when a member leave the guild, also configurable in the dashboard with more options.",
                            commandAlias: "No aliases",
                        },
                        ],
                    },
                ],
            }),
            settings: [
                {
                    categoryId: 'settings',
                    categoryName: "Main Settings",
                    categoryDescription: "All of the settings that do not have their own section.",
                    categoryOptionsList: [
                        {
                            optionId: 'prefix',
                            optionName: "Prefix",
                            optionDescription: "Set bot prefix. This will only be needed once legacy commands are added.",
                            optionType: DBD.formTypes.input('Prefix', 1, 4, false, false), // reqired false (if empty reset to default)
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.prefix;
                            },
                            setNew: async ({ guild, newData }) => {
                                await guildSchema.findOneAndUpdate(
                                    {
                                        id: guild.id
                                    },
                                    {
                                        prefix: newData
                                    }
                                );
                                return;
                            }
                        },

                        {
                            optionId: 'chatbot_channel',
                            optionName: "Chatbot Channel",
                            optionDescription: "Select the channel where chatbot will interact. To disable, select the value: -",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.settings.cbChId;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.settings.cbChId = newData || null;
                                await data.markModified("addons.settings");
                                await data.save();
                                return;
                            }
                        },
                    ]
                },

                {
                    categoryId: "wlcmgdbymsgs",
                    categoryName: "Welcome and Goodbye Settings",
                    categoryDescription: "Configure the welcome and goodbye settings and message for the guild.",
                    categoryOptionsList: [
                        {
                            optionType: 'spacer',
                            title: 'Welcome Message Configuration',
                            description: 'This is the section where you can edit all of the welcome message options and embeds. Continue scrolling to get to the goodbye messages area.'
                        },
                        {
                            optionId: 'switch_welcomeToggle',
                            optionName: "Toggle Welcome Message",
                            optionDescription: "Toggle the welcome system on and off.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                const SAVED_STATE = data.addons.welcome.enabled;
                                const DEFAULT_STATE = false;
                                return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.welcome.enabled = newData || null;
                                await data.markModified("addons.welcome");
                                await data.save();
                                return;
                            },
                        },
                        {
                            optionId: 'welcome_channel',
                            optionName: "Welcome Channel",
                            optionDescription: "Select the channel where welcome messaegs should be sent.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.welcome.channel;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.welcome.channel = newData || null;
                                await data.markModified("addons.welcome");
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'multiple_welcome_roles',
                            optionName: "Welcome Roles",
                            optionDescription: "Select the role(s) to give to a user when they join.",
                            optionType: DBD.formTypes.rolesMultiSelect(false, true),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.welcome.role || [];
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.welcome.role = newData || null;
                                await data.markModified("addons.welcome");
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'welcome_embed',
                            optionName: "Welcome Embed",
                            optionDescription: "Build your own Welcome Embed!",
                            optionType: DBD.formTypes.embedBuilder({
                                username: client.user.username,
                                avatarURL: client.user.avatarURL({ dynamic: true }),
                                defaultJson: {
                                    content: "Do you want to ping the user that just joined? Try puting {user.ping} here!",
                                    embed: {
                                        timestamp: null,
                                        url: "https://discord.com",
                                        description: "There was a boar, everyone liked a boar. One day the boar ate my dinner and escaped through the chimney. I haven't seen a boar since then.",
                                        author: {
                                            name: "Welcome to {guild.name}",
                                            url: "https://assistantscenter.com",
                                            icon_url: "https://media.discordapp.net/attachments/911644960590270484/934513385402413076/ac_fixed.png"
                                        },
                                        image: {
                                            url: "https://unsplash.it/380/200"
                                        },
                                        footer: {
                                            text: "Crated with Discord-Dashboard",
                                            icon_url: "https://cdn.discordapp.com/emojis/870635912437047336.png"
                                        },
                                        fields: [
                                            {
                                                name: "Hello",
                                                value: "Whats up dog? <:ac_love:806492057996230676>"
                                            },
                                            {
                                                name: "Do you know that",
                                                value: "You can use custom emojis there, even from server where bot isn't :Kekwlaugh:",
                                                inline: false
                                            },
                                        ]
                                    }
                                }
                            }),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.welcome.json;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.welcome.json = newData || null;
                                await data.markModified("addons.welcome");
                                await data.save();
                                return;
                            }
                        },

                        {
                            optionType: 'spacer',
                            title: 'Goodbye Message Configuration',
                            description: 'This is the section where you can edit all of the goobye message options and embeds. Continue scrolling to get to the goodbye messages area.'
                        },
                        {
                            optionId: 'switch_goodbyeToggle',
                            optionName: "Toggle Goodbye Message",
                            optionDescription: "Toggle the goodbye system on and off.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                const SAVED_STATE = data.addons.goodbye.enabled;
                                const DEFAULT_STATE = false;
                                return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.goodbye.enabled = newData || null;
                                await data.markModified("addons.goodbye");
                                await data.save();
                                return;
                            },
                        },
                        {
                            optionId: 'goodbye_channel',
                            optionName: "Goodbye Channel",
                            optionDescription: "Select the channel where goodbye messaegs should be sent.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.goodbye.channel;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.goodbye.channel = newData || null;
                                await data.markModified("addons.goodbye");
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'goodbye_embed',
                            optionName: "Goodbye Embed",
                            optionDescription: "Build your own Goodbye Embed!",
                            optionType: DBD.formTypes.embedBuilder({
                                username: client.user.username,
                                avatarURL: client.user.avatarURL({ dynamic: true }),
                                defaultJson: {
                                    content: "Do you want to ping the user that just joined? Try puting {user.ping} here!",
                                    embed: {
                                        timestamp: null,
                                        url: "https://discord.com",
                                        description: "There was a boar, everyone liked a boar. One day the boar ate my dinner and escaped through the chimney. I haven't seen a boar since then.",
                                        author: {
                                            name: "Goodbye {user.username}",
                                            url: "https://assistantscenter.com",
                                            icon_url: "https://media.discordapp.net/attachments/911644960590270484/934513385402413076/ac_fixed.png"
                                        },
                                        image: {
                                            url: "https://unsplash.it/380/200"
                                        },
                                        footer: {
                                            text: "Crated with Discord-Dashboard",
                                            icon_url: "https://cdn.discordapp.com/emojis/870635912437047336.png"
                                        },
                                        fields: [
                                            {
                                                name: "Hello",
                                                value: "Whats up dog? <:ac_love:806492057996230676>"
                                            },
                                            {
                                                name: "Do you know that",
                                                value: "You can use custom emojis there, even from server where bot isn't :Kekwlaugh:",
                                                inline: false
                                            },
                                        ]
                                    }
                                }
                            }),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.goodbye.json;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.goodbye.json = newData || null;
                                await data.markModified("addons.goodbye");
                                await data.save();
                                return;
                            }
                        },
                    ]
                },

                {
                    categoryId: "automodConfig",
                    categoryName: "Automod Settings",
                    categoryDescription: "Configure the automod settings.",
                    categoryOptionsList: [
                        {
                            optionType: 'spacer',
                            title: 'Automod Channels Configuration',
                            description: 'This is the section where you will configure channels for logging and where the bot should scan messages.'
                        },
                        {
                            optionId: 'automodChannels',
                            optionName: "Automod Channels",
                            optionDescription: "Add channels that the automod scan in..",
                            optionType: DBD.formTypes.channelsMultiSelect(false, false ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                return data.ChannelIDs || [];
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                data.ChannelIDs = newData;
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'logging_channel',
                            optionName: "Logging Channel",
                            optionDescription: "Select the channel where a embed containing the data of a message that was detected as toxic will be sent.",
                            optionType: DBD.formTypes.channelsMultiSelect(false, false ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                return data.LogChannelIDs;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                data.LogChannelIDs = newData || null;
                                await data.markModified();
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionType: 'spacer',
                            title: 'Punishment Configuration',
                            description: 'This is the section where you can edit all of the punishments that will be issued to people that break the certian levels of toxicity.'
                        },
                        {
                            optionId: 'lvl1',
                            optionName: "Level 1 Punishment",
                            optionDescription: "Select what you would like the punishment to be for toxicity that scores the level low.",
                            optionType: DBD.formTypes.select({"Delete Message": 'delete', "Timeout Author": 'timeout', "Kick Author": 'kick', "Ban Author": 'ban', "Do Nothing": null}),
                            getActualSet: async ({guild}) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                return data.Punishments[0];
                            },
                            setNew: async ({guild,newData}) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                data.Punishments[0] = newData || null;
                                await data.markModified();
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'lvl2',
                            optionName: "Level 2 Punishment",
                            optionDescription: "Select what you would like the punishment to be for toxicity that scores the level medium.",
                            optionType: DBD.formTypes.select({"Delete Message": 'delete', "Timeout Author": 'timeout', "Kick Author": 'kick', "Ban Author": 'ban', "Do Nothing": null}),
                            getActualSet: async ({guild}) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                return data.Punishments[1];
                            },
                            setNew: async ({guild,newData}) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                data.Punishments[1] = newData || null;
                                await data.markModified();
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'lvl3',
                            optionName: "Level 3 Punishment",
                            optionDescription: "Select what you would like the punishment to be for toxicity that scores the level high.",
                            optionType: DBD.formTypes.select({"Delete Message": 'delete', "Timeout Author": 'timeout', "Kick Author": 'kick', "Ban Author": 'ban', "Do Nothing": null}),
                            getActualSet: async ({guild}) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                return data.Punishments[2];
                            },
                            setNew: async ({guild,newData}) => {
                                const data = await automodSchema.findOne({ GuildID: guild.id });
                                data.Punishments[2] = newData || null;
                                await data.markModified();
                                await data.save();
                                return;
                            }
                        },
                    ]
                },

                {
                    categoryId: "loggingChannels",
                    categoryName: "Logging Channels",
                    categoryDescription: "Configure the logging channels.",
                    categoryOptionsList: [
                        {
                            optionId: 'memberLogs',
                            optionName: "Member Log Channel",
                            optionDescription: "Select the channel where member logs will be sent. To disable, select the value: -",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await loggingSchema.findOne({ GuildID: guild.id });
                                return data.memberLogs || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await loggingSchema.findOne({ GuildID: guild.id });
                                data.memberLogs = newData || null;
                                await data.markModified();
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'modLogs',
                            optionName: "Mod Log Channel",
                            optionDescription: "Select the channel where mod logs will be sent. To disable, select the value: -",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await loggingSchema.findOne({ GuildID: guild.id });
                                return data.modLogs || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await loggingSchema.findOne({ GuildID: guild.id });
                                data.modLogs = newData || null;
                                await data.markModified();
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'guildLogs',
                            optionName: "Guild Log Channel",
                            optionDescription: "Select the channel where guild logs will be sent. To disable, select the value: -",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await loggingSchema.findOne({ GuildID: guild.id });
                                return data.guildLogs || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await loggingSchema.findOne({ GuildID: guild.id });
                                data.guildLogs = newData || null;
                                await data.markModified();
                                await data.save();
                                return;
                            }
                        },
                    ]
                },

                {
                    categoryId: "xpconfig",
                    categoryName: "XP Settings",
                    categoryDescription: "Configure the XP settings.",
                    categoryOptionsList: [
                        {
                            optionId: 'switch_xpToggle',
                            optionName: "Toggle XP System",
                            optionDescription: "Toggle the XP system on and off.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                const SAVED_STATE = data.addons.xp.enabled;
                                const DEFAULT_STATE = false;
                                return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.xp.enabled = newData || null;
                                await data.markModified("addons.xp");
                                await data.save();
                                return;
                            },
                        },

                        {
                            optionId: 'level_channel',
                            optionName: "Rank Up Channel",
                            optionDescription: "Select the channel where rank up messages should be sent to. You do not need to select a channel",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.xp.channel;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.xp.channel = newData || null;
                                await data.markModified("addons.xp");
                                await data.save();
                                return;
                            }
                        },

                        {
                            optionId: 'background',
                            optionName: "Background",
                            optionDescription: "Change the background for the rank up car.",
                            optionType: DBD.formTypes.input('Image URL'), // reqired false (if empty reset to default)
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.xp.background;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.xp.background = newData || null;
                                await data.markModified("addons.xp");
                                await data.save();
                                return;
                            }
                        },
                    ]
                }
            ]
        });
        Dashboard.init();
    })();
}

module.exports.init = init;