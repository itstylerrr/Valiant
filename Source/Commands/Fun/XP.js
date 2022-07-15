const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const xp = require("simply-xp");

module.exports = {
  name: "xp",
  description: "Use all the options for the XP from 1 command.",
  public: true,
  options: [
    {
      name: "user",
      description: "All commands that the user is able to use.",
      type: "SUB_COMMAND_GROUP",
      options: [
        {
          name: "rank",
          description: "View the rank of you or someone else.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description:
                "The user you want to view the rank of. To view yours, leave blank.",
              type: "USER",
            },
          ],
        },
        {
          name: "leaderboard",
          description: "View the leaderboard for the guild.",
          type: "SUB_COMMAND",
        },
        {
          name: "chart",
          description: "View a chart for the guilds XP system.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "users",
              description: "The ammount of users to include in the chart.",
              type: "INTEGER",
              min_value: 1,
              max_value: 15,
            },
            {
              name: "type",
              description: "Select the type of chart to display.",
              type: "STRING",
              choices: [
                { name: "📏 Line", value: "line" },
                { name: "📊 Bar", value: "bar" },
                { name: "🔘 Radar", value: "radar" },
                { name: "🍩 Doughnut", value: "doughnut" },
                { name: "🐻‍❄️ Polar Area", value: "polarArea" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "rolesetup",
      description: "Setup auto roles/level roles.",
      type: "SUB_COMMAND_GROUP",
      options: [
        {
          name: "add",
          description: "Add a level role to the guild.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "role",
              description: "What role should the user be given?",
              type: "ROLE",
              required: true,
            },
            {
              name: "level",
              description: "At what level should the role be assigned?",
              type: "INTEGER",
              required: true,
            },
          ],
        },
        {
          name: "remove",
          description: "Remove a level role from the guild.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "level",
              description: "What level role should be removed?",
              type: "INTEGER",
              required: true,
            },
          ],
        },
        {
          name: "fetch",
          description: "Fetch the level roles that the guild has setup.",
          type: "SUB_COMMAND",
        },
        {
          name: "find",
          description: "Find a level role.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "level",
              description: "What level role do you want to find?",
              type: "INTEGER",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "admin",
      description: "All of the commands for administrators to use.",
      type: "SUB_COMMAND_GROUP",
      options: [
        {
          name: "addlevel",
          description: "Add a level to a user of your choice.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description: "The user to add the level(s) to.",
              type: "USER",
              required: true,
            },
            {
              name: "amount",
              description: "The amount of levels to add to the user.",
              type: "INTEGER",
              required: true,
            },
          ],
        },
        {
          name: "addxp",
          description: "Add xp to a user of your choice.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description: "The user to add the xp to.",
              type: "USER",
              required: true,
            },
            {
              name: "amount",
              description: "The amount of xp to add to the user.",
              type: "INTEGER",
              required: true,
            },
          ],
        },
        {
          name: "setlevel",
          description: "Set the current level of a user of your choice.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description: "The user to set the level of.",
              type: "USER",
              required: true,
            },
            {
              name: "level",
              description: "The level to set the user to.",
              type: "INTEGER",
              required: true,
            },
          ],
        },
        {
          name: "reset",
          description: "Reset a users XP in the guild.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description: "The user whos XP should get reset.",
              type: "USER",
              required: true,
            },
          ],
        },
        {
          name: "background",
          description: "Set the background of the guilds rank card.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "url",
              description:
                "The url to the image that should be the background of the guilds rank card.",
              type: "STRING",
              required: true,
            },
          ],
        },
        {
          name: "lvlchannel",
          description: "Set the channel where level up messages should be sent.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "channel",
              description: "The channel where level up messages should be sent.",
              type: "CHANNEL",
              channelTypes: ["GUILD_TEXT"],
              required: true,
            }
          ]
        },
        {
          name: "toggle",
          description: "Toggle the XP system (turn on or off).",
          type: "SUB_COMMAND",
          options: [
            {
              name: "value",
              description: "Toggle the XP system (turn on or off).",
              type: "STRING",
              choices: [
                { name: "✅ Enable", value: "enabled" },
                { name: "🚫 Disable", value: "disabled" },
              ],
            },
          ],
        },
      ],
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, data) {
    try {
          // ⟬                    Logging                    ⟭

    if (data.guild.addons.settings.loggingId) {
      let log = client.channels.cache.get(data.guild.addons.settings.loggingId);
      let logEmbed = new MessageEmbed()
        .setTitle(`${interaction.guild.name}'s Command Logging`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(
          `**This is an automated message sent by <@${client.user.id}>**`
        )
        .addFields(
          { name: "Command Name:", value: `${data.cmd.name}` },
          { name: "Ran By:", value: `${interaction.user}` },
          {
            name: "Timestamp:",
            value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`,
          }
        )
        .setColor("BLURPLE")
        .setFooter(`Invite ${data.config.botinfo.name}`);

      log.send({
        embeds: [logEmbed],
      });
    }

    // ⟬                    Command                    ⟭
    const { options } = interaction;

    switch (options.getSubcommandGroup()) {
      case "rolesetup": {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("🚫 Only administrators can alter level roles.")
                .setColor("RED"),
            ],
          });
        }
        switch (options.getSubcommand()) {
          case "add": {
            const role = options.getRole("role");
            const lvl = options.getInteger("level");

            xp.roleSetup
              .add(client, interaction.guildId, {
                level: lvl,
                role: role.id,
              })
              .then((l) => {
                if (l) {
                  interaction.reply({
                    embeds: [
                      new MessageEmbed()
                        .setTitle("✅ New Level Role")
                        .setDescription(
                          `**Role:** ${role}\n\n**Level:** ${lvl}`
                        )
                        .setColor("GREEN"),
                    ],
                  });
                }
              })
              .catch((e) => {
                interaction.reply({ content: `Error: ${e}` });
              });
            return;
          }

          case "remove": {
            const lvl = options.getInteger("level");

            xp.roleSetup
              .remove(client, interaction.guildId, {
                level: lvl,
              })
              .then((l) => {
                if (l) {
                  interaction.reply({
                    embeds: [
                      new MessageEmbed()
                        .setTitle("✅ Removed Level Role")
                        .setDescription(`**Level:** ${lvl}`)
                        .setColor("GREEN"),
                    ],
                  });
                }
              })
              .catch((e) => {
                interaction.reply({ content: `Error: ${e}` });
              });
            return;
          }

          case "fetch": {
            const lvlRole = await xp.roleSetup.fetch(
              client,
              interaction.guildId
            );
            const Embed = new MessageEmbed()
              .setTitle(`${interaction.guild.name}'s Level Roles`)
              .setColor(interaction.guild.me.displayHexColor)
              .setFooter(`${interaction.guild.me.displayName} | /invite`);
            lvlRole.forEach((role) => {
              Embed.addField(`Level ${role.lvl}:`, `<@&${role.role}>`);
            });

            interaction.reply({
              embeds: [Embed],
            });
            return;
          }

          case "find": {
            const int = options.getInteger("level");

            const lvlRole = await xp.roleSetup.find(
              client,
              interaction.guildId,
              int
            );

            if (!lvlRole) {
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("🚫 No level role found.")
                    .setColor("RED"),
                ],
              });
            }

            const Embed = new MessageEmbed()
              .setTitle("✅ Succesfully Found a Role")
              .setDescription(
                `If you have multiple roles setup for this level, I am only able to show the first one. To view all roles, use \`/xp rolesetup fetch\`.\n\n**Level ${lvlRole.lvl}:**\n **Role:** <@&${lvlRole.role}>`
              )
              .setColor(interaction.guild.me.displayHexColor)
              .setFooter(`${interaction.guild.me.displayName} | /invite`);

            interaction.reply({
              embeds: [Embed],
            });
            return;
          }
        }
      }
      case "user": {
        switch (options.getSubcommand()) {
          case "rank": {
            const member = options.getMember("user") || interaction.user;
            xp.rank(interaction, member.id, interaction.guild.id, {
              background: data.guild.addons.xp.background || "https://wallpaperaccess.com/full/1151440.jpg",
              color: interaction.guild.me.displayHexColor,
            })
              .then(async (img) => {
                await interaction.deferReply();
                await interaction.followUp({ files: [img] });
              })
              .catch((err) => {
                return interaction.followUp({
                  embeds: [
                    new MessageEmbed()
                      .setTitle("🚫 Error")
                      .setDescription(`\`\`\`${err}\`\`\``)
                      .setColor("RED"),
                  ],
                });
              });
          }

          case "leaderboard" : {
            await xp.leaderboard(client, interaction.guildId).then(board => {
              let lb = [];
              board.forEach(user => {
                lb.push(`**⟦ ${user.position} ⟧** ${user.tag} | **XP:** ${user.shortxp}\n\n`)
              });

              interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setTitle(`👑 ${interaction.guild.name}'s XP Leaderboard 👑`)
                  .setDescription(lb.join(' '))
                  .setFooter(`💝 ${client.application.name} | /invite`)
                  .setColor(interaction.guild.me.displayHexColor)
                ]
              });
            });
            return;
          }

          case "chart" : {
            const num = options.getInteger("users") || 5;
            const type = options.getString("type") || "line";

            xp.charts(interaction, {
              position: num,
              type: type,
            }).then((attach) => {
              return interaction.reply({
                files: [attach]
              });
            });
          }
        }
      }

      case "admin": {
        switch (options.getSubcommand()) {
          case "addlevel": {
            const user = options.getUser("user");
            const num = options.getInteger("amount");
            const word = num >= 2 ? "levels" : "level";
            xp.addLevel(interaction, user.id, interaction.guildId, num).then(
              interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setDescription(
                      `✅ Succesfully added ${num} ${word} to ${user}`
                    )
                    .setColor("GREEN"),
                ],
              })
            );
            return;
          }

          case "addxp" : {
            const user = options.getUser("user");
            const num = options.getInteger("amount");

            xp.addXP(interaction, user.id, interaction.guildId, num).then(
              interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setDescription(`✅ Succesfully added ${num} XP to ${user}`)
                  .setColor("GREEN")
                ]
              })
            );
            return;
          }

          case "setlevel" : {
            const user = options.getUser("user");
            const num = options.getInteger("level");

            xp.setLevel(interaction, user.id, interaction.guildId, num).then(
              interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setDescription(`✅ Succesfully set ${user}'s level to level ${num}.`)
                  .setColor("GREEN")
                ]
              })
            );
            return;
          }

          case "reset" : {
            const user = options.getUser("user");

            xp.reset(user.id, interaction.guildId).then(
              interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setDescription(`✅ Succesfully reset ${user}'s XP database.`)
                  .setColor("GREEN")
                ]
              })
            );
            return;
          }

          case "background" : {
            function isImage(url) {
              return /\.(jpg|jpeg|png|svg)$/.test(url);
            }
            const bg = isImage(options.getString("url"));
            if (bg === false) {
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setTitle("🚫 Must be a valid image.")
                  .setColor("RED")
                ]
              });
            } else if (bg === true) {
              data.guild.addons.xp.background = options.getString("url");
              await data.guild.markModified("addons");
              await data.guild.save();
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setTitle("✅ Updated the guilds XP card background.")
                  .setColor("GREEN")
                  .setImage(options.getString("url"))
                ]
              });
            }
          }

          case "lvlchannel" : {
            const chan = options.getChannel("channel");
            data.guild.addons.xp.channel = chan.id;
            await data.guild.markModified("addons");
            await data.guild.save();

            return interaction.reply({
              embeds: [
                new MessageEmbed()
                .setDescription(`✅ Set rank up message channel to ${chan}.`)
                .setColor("GREEN")
              ]
            });
          }

          case "toggle" : {
            const tog = options.getString("value");

            if (tog === "enabled") {
              data.guild.addons.xp.enabled = true;
              await data.guild.markModified("addons");
              await data.guild.save();
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setTitle(`✅ XP system has been ${tog}.`)
                  .setColor("GREEN")
                ]
              });
            }

            if (tog === "disabled") {
              data.guild.addons.xp.enabled = false;
              await data.guild.markModified("addons");
              await data.guild.save();
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                  .setTitle(`🚫 XP system has been ${tog}.`)
                  .setColor("RED")
                ]
              });
            }
          }
        }
      }
    }
    } catch (error) {
      console.log(error);
      if (interaction.replied) {
        interaction.channel.send({
          embeds: [
            new MessageEmbed()
            .setTitle(`🚫 Error while executing ${data.cmd.xp}`)
            .setDescription(`\`\`\`${error}\`\`\``)
            .setColor("GREEN")
          ]
        });
      } else {
        interaction.reply({
          embeds: [
            new MessageEmbed()
            .setTitle(`🚫 Error while executing ${data.cmd.xp}`)
            .setDescription(`\`\`\`${error}\`\`\``)
            .setColor("GREEN")
          ]
        });
      }
      return;
    }
  },
};
