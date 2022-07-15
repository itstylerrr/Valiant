const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const config = require("../../../Configs/main.json");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const DB = require("../../Structures/Database/Schemas/ModerationDB");

const Perspective = require("perspective-api-client");
const perspective = new Perspective({
  apiKey: config.API.google,
});

module.exports = {
  name: "messageCreate",

  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const { author, member, content, guild, channel } = message;

    const messageContent = message.content.toLowerCase().split(" ");
    if (
      author.bot ||
      member.permissions.has([
        "ADMINISTRATOR",
        "MANAGE_GUILD",
        "MODERATE_MEMBERS",
      ])
    )
      return; // Ignore

    const analyzeRequest = {
      comment: {
        text: content,
      },
      requestedAttributes: {
        TOXICITY: {},
      },
    };

    const speech = await perspective.analyze(analyzeRequest).catch((err) => {});
    if (!speech || !speech.attributeScores) return;

    const score = speech.attributeScores.TOXICITY.summaryScore.value; // Min: 0.0, Max: 1.0

    // Chart Generation
    const width = 1500;
    const height = 720;
    const scoreInt = Math.round(score * 100);

    const plugin = {
      id: "scoreText",
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext("2d");
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.font = "800 90px Arial";
        ctx.fillStyle = "#DDDDDD";
        ctx.fillText(
          `${scoreInt}%`,
          chart.width / 2 - 75,
          chart.height / 2 + 25
        );
        ctx.textAlign = "center";
        ctx.restore();
      },
    };

    const chartCallback = (ChartJS) => {};
    const canvas = new ChartJSNodeCanvas({
      width: width,
      height: height,
      chartCallback: chartCallback,
    });

    const data = {
      labels: ["Message"],
      datasets: [
        {
          label: "Toxicity",
          data: [score, 1 - score],
          backgroundColor: ["#FF555599", "#FF555500"],
          borderColor: ["#FF5555", "#FFFFFF00"],
          borderWidth: [5, 0],
          borderRadius: 25,
          borderSkipped: false,
        },
      ],
    };

    const chartConfig = {
      type: "doughnut",
      data: data,
      plugins: [plugin],
      options: {
        responsive: true,
        plugins: {
          title: {
            display: false,
            text: "Toxicity Score",
          },
          legend: {
            display: false,
          },
        },
      },
    };

    const image = await canvas.renderToBuffer(chartConfig);
    const attachment = new MessageAttachment(image, "chart.png");

    // Database
    const docs = await DB.findOne({
      GuildID: guild.id,
    });

    if (!docs) return;

    const low = docs.Punishments[0];
    const medium = docs.Punishments[1];
    const high = docs.Punishments[2];

    const logChannels = docs.LogChannelIDs;

    // Action
    if (docs.ChannelIDs.includes(channel.id)) {
      if (score > 0.75 && score <= 0.8) {
        if (low === "delete") {
          message.delete();

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Deleted] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });
        } else if (low === "timeout") {
          message.delete();
          member.timeout(
            5 * 60000, // 5 minutes
            "Toxicity Detected"
          );

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Timeout] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });

          try {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Timed Out!")
                  .setDescription(
                    `${author} You Are On 5 minutes Timeout From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          } catch (err) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }
        } else if (low === "kick") {
          message.delete();
          member.kick("Toxicity Detected");

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Kicked] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });

          try {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Kicked!")
                  .setDescription(
                    `${author} You Have Been Kicked From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          } catch (err) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }

        } else if (low === "ban") {
          message.delete();
          member.ban({
            days: 7,
            reason: "Toxicity Detected",
          });

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Banned] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });

          try {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Banned!")
                  .setDescription(
                    `${author} You Have Been Banned From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          } catch (err) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }
        }
      } else if (score > 0.8 && score <= 0.85) {
        if (medium === "delete") {
          message.delete();

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Deleted] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });
        } else if (medium === "timeout") {
          message.delete();
          member.timeout(
            5 * 60000, // 5 minutes
            "Toxicity Detected"
          );

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Timeout] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });

          try {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Timed Out!")
                  .setDescription(
                    `${author} You Are On 5 minutes Timeout From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          } catch (err) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }
        } else if (medium === "kick") {
          message.delete();
          member.kick("Toxicity Detected");

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Kicked] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });

          try {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          } catch (err) {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Kicked!")
                  .setDescription(
                    `${author} You Have Been Kicked From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          }
        } else if (medium === "ban") {
          message.delete();
          member.ban({
            days: 7,
            reason: "Toxicity Detected",
          });

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Banned] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });

          try {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Banned!")
                  .setDescription(
                    `${author} You Have Been Banned From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          } catch (err) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }
        }
      } else if (score > 0.85 && score >= 0.9) {
        if (high === "delete") {
          message.delete();

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Deleted] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });
        } else if (high === "timeout") {
          message.delete();
          member.timeout(
            5 * 60000, // 5 minutes
            "Toxicity Detected"
          );

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Timeout] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });

          try {
          member.send({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setTitle("You Have Been Timed Out!")
                .setDescription(
                  `${author} You Are On 5 minutes Timeout From **${guild.name}** For Toxic Messages!`
                )
                .addFields(
                  {
                    name: "Message: ",
                    value: `\`\`\`${message}\`\`\``,
                    inline: true,
                  },
                  {
                    name: "Score: ",
                    value: `\`\`\`${score}\`\`\``,
                    inline: true,
                  }
                )
                .setImage("attachment://chart.png")
                .setTimestamp(),
            ],
            files: [attachment],
          });
          } catch (err) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }
        } else if (high === "kick") {
          message.delete();
          member.kick("Toxicity Detected");

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Kicked] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });
          try {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Kicked!")
                  .setDescription(
                    `${author} You Have Been Kicked From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          } catch (e) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }
        } else if (high === "ban") {
          message.delete();
          member.ban({
            days: 7,
            reason: "Toxicity Detected",
          });

          logChannels.forEach((channel) => {
            const eachChannel = guild.channels.cache.get(channel);

            const embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("[Banned] Toxic Message Detected!")
              .setDescription(
                `Valiant Has Detected A Toxic Message!\n
                            **<:replycontinued:994779111018999898> User**: ${author} | ${author.id}
                            **<:reply:994779155243737129> Channel**: ${message.channel}
                            ㅤ
                            `
              )
              .addFields(
                {
                  name: "Message: ",
                  value: `\`\`\`${message}\`\`\``,
                  inline: true,
                },
                {
                  name: "Score: ",
                  value: `\`\`\`${score}\`\`\``,
                  inline: true,
                }
              )
              .setImage("attachment://chart.png")
              .setTimestamp();

            eachChannel.send({
              embeds: [embed],
              files: [attachment],
            });
          });
          try {
            member.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("You Have Been Banned!")
                  .setDescription(
                    `${author} You Have Been Banned From **${guild.name}** For Toxic Messages!`
                  )
                  .addFields(
                    {
                      name: "Message: ",
                      value: `\`\`\`${message}\`\`\``,
                      inline: true,
                    },
                    {
                      name: "Score: ",
                      value: `\`\`\`${score}\`\`\``,
                      inline: true,
                    }
                  )
                  .setImage("attachment://chart.png")
                  .setTimestamp(),
              ],
              files: [attachment],
            });
          } catch (err) {
            message.channel.send({
              embeds: [
                new MessageEmbed()
                .setTitle("🚫 Couldnt DM user, punishment has been succeded though.")
                .setColor("RED")
              ]
            });
          }
        }
      }
    } else {
      return;
    }
  },
};
