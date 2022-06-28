const { 
    ButtonInteraction, 
    MessageEmbed, 
} = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

const TicketSetupData = require("../../Structures/Database/Schemas/TicketSetup")
const DB = require("../../Structures/Database/Schemas/Ticket");

module.exports = {
    name: "interactionCreate",

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if(!interaction.isButton()) return;
        const { guild, customId, channel, member } = interaction;
        if(!["close", "lock", "unlock", "claim"].includes(customId)) return;

        const TicketSetup = await TicketSetupData.findOne({GuildID: guild.id});
        if(!TicketSetup) 
        return interaction.reply({content: "The data for this system is outdated."})

        if (!member.roles.cache.find((r) => r.id === TicketSetup.Handlers)) 
        return interaction.reply({ content: "You don't have the permissions to use this button", ephemeral: true })

        const Embed = new MessageEmbed().setColor("BLUE");

        DB.findOne({ ChannelID: channel.id }, async(err, docs) => {
            if(err) throw err;
            if(!docs)
            return interaction.reply({
                content: "No data was found related to this ticket, please delete manual.",
                ephemeral: true
            });
            switch(customId) {
                case "lock" :
                    if(docs.Locked == true)
                    return interaction.reply({
                        content: "This thicket has already been locked",
                        ephemeral: true
                    });
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
                    Embed.setDescription("🔒 | This ticket has been locked for reviewing.")

                    docs.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {
                            SEND_MESSAGES: false,
                        });
                    });
                    return interaction.reply({ embeds: [Embed] });
                    break;
                case "unlock":
                    if(docs.Locked == false)
                    return interaction.reply({
                        content: "This thicket has already been unlocked",
                        ephemeral: true
                    });
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
                    Embed.setDescription("🔓 | This ticket has been unlocked.")

                    docs.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {
                            SEND_MESSAGES: true,
                        });
                    });
                    return interaction.reply({ embeds: [Embed] });
                    break;
                    case "close":
                        if(docs.Closed == true)
                        return interaction.reply({ 
                            content: "Ticket has been closed, please wait for it to create an transcript.",
                            ephemeral: true,
                    });

                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${docs.Type} - ${docs.TicketID}.html`,
                    });
                    await DB.updateOne({ChannelID: channel.id}, { Closed: true });

                    const Message = await guild.channels.cache
                    .get(TicketSetup.Transcripts)
                    .send({
                        embeds: [
                        Embed.setDescription(
                            `Ticket Type: ${docs.Type}\nTicket ID: ${docs.TicketID}\nOpened By: <@${docs.OwnerID}>\nClosed By: <@${member.id}>`
                        ),
                        ],
                        files: [attachment]
                    });

                    const errorEmbed = new MessageEmbed()
                    .setColor("RED");

                    const successEmbed = new MessageEmbed()
                    .setColor("GREEN");

                    docs.MembersID.forEach((m) => {

                        const user = guild.members.cache.get(m)
                    
                    user.send({
                        content: "The ticket has been closed.",
                        embeds: [
                            Embed.setDescription(
                                `Ticket Type: ${docs.Type}\nTicket ID: ${docs.TicketID}\nOpened By: <@${docs.OwnerID}>\nClosed By: <@${member.id}>`)
                            ],
                        files: [attachment]
                    }).then(async () => {
                        successEmbed.setDescription(`The transcript has been saved [TRANSCRIPT](${Message.url})`)
                        return interaction.reply({content: "**The ticket has been closed, and will be deleted in 5 seconds.**",embeds: [successEmbed]});
                    }).catch((err) => {
                        successEmbed.setDescription(`The transcript has been saved [TRANSCRIPT](${Message.url})`)
                        return interaction.reply({content: "**The ticket has been closed, and will be deleted in 5 seconds.**",embeds: [successEmbed]});
                    });
                    });

                    setTimeout(() => {
                        channel.delete();
                        DB.findOneAndDelete({ ChannelID: channel.id }, function (err, docs) {
                            if (err){
                                console.log(err)
                            }
                            else{
                            }
                        });
                    }, 5 * 1000);

                    break;
                    case "claim":
                        if(docs.Claimed == true)
                            return interaction.reply({content: `This ticket has already been claimed by <@${docs.Claimedby}>`, ephemeral: true
                            });

                            await DB.updateOne({ChannelID: channel.id}, {Claimed: true, Claimedby: member.id})

                            channel.setName(`${member.user.username} ${docs.TicketID}`)

                            Embed.setDescription(`🛡 | This ticket has been claimed by ${member}`);
                            interaction.reply({ embeds: [Embed] });
                        break;

            }
        });
    },
};