require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    Partials,
    ChannelType,
    PermissionsBitField 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.once("ready", () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});


// 🎉 MESSAGE DE BIENVENUE
client.on("guildMemberAdd", member => {

    const channel = member.guild.channels.cache.find(
        c => c.name === "bienvenue"
    );

    if(!channel) return;

    channel.send(`👋 Bienvenue ${member} sur le serveur RP !`);
});


// 👮‍♂️ COMMANDES MODERATION

client.on("messageCreate", async message => {

    if(message.author.bot) return;

    const args = message.content.split(" ");

    // KICK
    if(args[0] === "!kick"){

        if(!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("❌ Tu n'as pas la permission.");

        const member = message.mentions.members.first();
        if(!member) return message.reply("Mentionne un joueur.");

        member.kick();
        message.channel.send(`👢 ${member.user.tag} a été kick.`);
    }

    // BAN
    if(args[0] === "!ban"){

        if(!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("❌ Tu n'as pas la permission.");

        const member = message.mentions.members.first();
        if(!member) return message.reply("Mentionne un joueur.");

        member.ban();
        message.channel.send(`🔨 ${member.user.tag} a été ban.`);
    }

    // MUTE (timeout)
    if(args[0] === "!mute"){

        if(!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply("❌ Tu n'as pas la permission.");

        const member = message.mentions.members.first();
        if(!member) return message.reply("Mentionne un joueur.");

        member.timeout(10 * 60 * 1000);
        message.channel.send(`🔇 ${member.user.tag} mute 10 minutes.`);
    }

});


// 🎫 COMMANDE TICKET

client.on("messageCreate", async message => {

    if(message.content === "!ticket"){

        const channel = await message.guild.channels.create({
            name: `ticket-${message.author.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: message.author.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        });

        channel.send(`🎫 Ticket ouvert par ${message.author}`);
    }
});

client.login(process.env.TOKEN);
