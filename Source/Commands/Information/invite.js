const {
  CommandInteraction,
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite the bot to your server!",
  permission: "SEND_MESSAGES",
  public: true,
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, data) {
    const Invite = new MessageEmbed()
      .setTitle("Invite Me!")
      .setDescription(
        "Thank you for showing your interest in wanting to implement me into your own server! Use the buttons below to invite me to your server or join our support server!\n\nStay Safe 👋"
      )
      .setColor(interaction.guild.me.displayHexColor)
      .setThumbnail(client.user.displayAvatarURL());

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client?.user?.id}&permissions=8&scope=bot%20applications.commands`
        )
        .setLabel("Invite Me")
        .setStyle("LINK"),

      new MessageButton()
        .setURL(`https://discord.gg/a7V6C4dAQj`)
        .setLabel("Support Server")
        .setStyle("LINK")
    );

    return interaction.reply({
        embeds: [Invite],
        components: [row],
        ephemeral: true,
    });
  },
};
