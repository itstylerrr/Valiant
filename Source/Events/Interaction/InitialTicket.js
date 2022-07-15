const { 
    ButtonInteraction, 
    MessageEmbed, 
    MessageActionRow, 
    MessageButton 
} = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Ticket");
const TicketSetupData = require("../../Structures/Database/Schemas/TicketSetup");
const client = require("../../Structures/valiant");


module.exports = {
    name: "interactionCreate",

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    async execute(interaction) {
        try {
            if(!interaction.isButton()) return;
        const { guild, member, customId } = interaction;

        const Data = await TicketSetupData.findOne({GuildID: guild.id});
        if(!Data) return;

        if(!Data.Buttons.includes(customId)) return;

        const ID = Data.TicketID + 1

        await TicketSetupData.findOneAndUpdate({
            GuildID: guild.id}, {
                TicketID: ID,
            },
            {
                new: true,
                upsert: true,
            }
            );
            console.log("Button Data:" + customId + ID);
            console.log("Everyone ID: " + Data.Everyone + "Handler Roles: " + Data.Handlers + "Member ID: " +  member.id );

        await guild.channels.create(`${customId} ${ID}`, {
            type: "GUILD_TEXT",
            parent: Data.Category,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
            ],
        }).then(async(channel) => {
            await DB.create ({
                GuildID: guild.id,
                MembersID: member.id,
                OwnerID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
                Claimed: false,
            });

            const memberSend = new MessageEmbed()
            .setTitle("New Ticket opened!")
            .setDescription(`Your ticket that you have opened can be found at ${channel}`)

        await member.send({embeds: [memberSend]}).catch((err) => {
        })

            const Embed = new MessageEmbed().setAuthor(
                {name: `${guild.name} | Ticket ID: ${ID}`,
                iconURL: guild.iconURL({ dynamic: true })}
                )
                .setDescription(`${Data.TicketDescription}`)
                .setFooter({text: "The buttons below is for staffs only."})
        
                const Buttons = new MessageActionRow();
                Buttons.addComponents (
                    new MessageButton()
                    .setCustomId("close")
                    .setLabel("Close")
                    .setStyle("PRIMARY")
                    .setEmoji("💾"),
        
                    new MessageButton()
                    .setCustomId("lock")
                    .setLabel("Lock")
                    .setStyle("PRIMARY")
                    .setEmoji("🔒"),
        
                    new MessageButton()
                    .setCustomId("unlock")
                    .setLabel("Unlock")
                    .setStyle("PRIMARY")
                    .setEmoji("🔓"),

                    new MessageButton()
                    .setCustomId("claim")
                    .setLabel("Claim")
                    .setStyle("PRIMARY")
                    .setEmoji("🛡"),
                );
        
                channel.send({ 
                    content: `${Data.Content}`,
                    embeds: [Embed], 
                    components: [Buttons] 
                });
        
                interaction.reply({ 
                    content: `${member}, your ticket has been created: ${channel}`,
                    ephemeral: true,
                });
            });
        } catch (e) {
            console.log("InitialTicket Error: " + e);
            return;
        }
    },
};