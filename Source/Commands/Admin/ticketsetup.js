const { 
    MessageEmbed, 
    CommandInteraction, 
    MessageActionRow, 
    MessageButton
} = require("discord.js");
const DB = require("../../Structures/Database/Schemas/TicketSetup");

module.exports = {
    name: "ticketsetup",
    permissions: "ADMINISTRATOR",
    public: true,
    description: "Setup an openticket in the tickets channel.",
    options: [
        {name: "channel", description: "Select the where the ticketsetup is sent too.", required: true, type: "CHANNEL", channelTypes: ["GUILD_TEXT"]},
        {name: "category", description: "Select the ticket channel's creation category.", required: true, type: "CHANNEL", channelTypes: ["GUILD_CATEGORY"]},
        {name: "transcripts", description: "Select the transcript channal.", required: true, type: "CHANNEL", channelTypes: ["GUILD_TEXT"]},
        {name: "handlers", description: "Select the ticket handler's role.", required: true, type: "ROLE"},
        {name: "everyone", description: "Provide the @everyone role.", required: true, type: "ROLE"},
        {name: "description", description: "Provide the description for the embed being sent.", required: true, type: "STRING"},
        {name: "ticketdescription", description: "Provide the description for the embed being sent in the ticket.", required: true, type: "STRING"},
        {name: "content", description: "Provide the content for the text message being sent in the ticket.", required: true, type: "STRING"},
        {name: "firstbutton", description: "Give your first button a name and add a emoji, by putting a comma inbetween the two.", required: true, type: "STRING"},
        {name: "secondbutton", description: "Give your second button a name and add a emoji, by putting a comma inbetween the two.", required: true, type: "STRING"},
        {name: "thirdbutton", description: "Give your third button a name and add a emoji, by putting a comma inbetween the two.", required: true, type: "STRING"},
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { guild, options } = interaction;

        try {
            const Channel = options.getChannel("channel");
            const Category = options.getChannel("category");
            const Transcript = options.getChannel("transcripts");
            const Handlers = options.getRole("handlers");
            const Everyone = options.getRole("everyone");

            const Description = options.getString("description");
            const TicketDescription = options.getString("ticketdescription");
            const Content = options.getString("content");

            const Button1 = options.getString("firstbutton").split(",");
            const Button2 = options.getString("secondbutton").split(",");
            const Button3 = options.getString("thirdbutton").split(",");

            const Emoji1 = Button1[1];
            const Emoji2 = Button2[1];
            const Emoji3 = Button3[1];

            const Description2 = Description.replace(/\\n/g, "\n");
            const TicketDescription2 = TicketDescription.replace(/\\n/g, "\n");
            const Content2 = Content.replace(/\\n/g, "\n");

            await DB.findOneAndUpdate({
                GuildID: guild.id}, {
                    Channel: Channel.id, 
                    Category: Category.id, 
                    Transcripts: Transcript.id, 
                    Handlers: Handlers.id, 
                    Everyone: Everyone.id,
                    Description: Description2,
                    TicketDescription: TicketDescription2,
                    TicketID: 0,
                    Content: Content2,
                    Buttons: [Button1[0], Button2[0], Button3[0]],
                },
                {
                    new: true,
                    upsert: true,
                }
                );
                const Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                    .setCustomId(Button1[0])
                    .setLabel(Button1[0])
                    .setStyle("PRIMARY")
                    .setEmoji(Emoji1),
        
                    new MessageButton()
                    .setCustomId(Button2[0])
                    .setLabel(Button2[0])
                    .setStyle("PRIMARY")
                    .setEmoji(Emoji2),

                    new MessageButton()
                    .setCustomId(Button3[0])
                    .setLabel(Button3[0])
                    .setStyle("PRIMARY")
                    .setEmoji(Emoji3),
                );

                const Embed = new MessageEmbed()
                .setAuthor({name: guild.name + " | Ticket System",
                iconURL: guild.iconURL({ dynamic: true })}
                )
                .setDescription(Description2)
                .setColor(
                    "0000FF"
                );
        
                await guild.channels.cache
                .get(Channel.id)
                .send({ embeds: [Embed], components: [Buttons] });
        
                interaction.reply({ content: `The embed was sent to ${Channel}`, ephemeral: true})

        } catch (err) {
            const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`⛔ | An error has occured while setting up your ticket system\n**What to make sure of?**
            1. Make sure non of your buttons' name are duplicated
            2. Make sure you use this format for your buttons -> Name,Emoji
            3. Make sure your button names do not exceed the 200 characters
            4. Make sure your button emojis, are actually emojis, and not ids`
            );
            interaction.reply({embeds: [errEmbed]})
        }
    },
};