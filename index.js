const Discord = require("discord.js");
const Client = new Discord.Client();
const RpgCount = require('./models/rpgcounters')
const mongoose = require("mongoose");
const { prefix, token, DB_URL } = require('./config.json');
const { db } = require("./models/rpgcounters");
const cron = require("node-cron");  //using this module for resetting the leaderboard everyday



Client.on('ready', () => {
    console.log(`Logged in as ${Client.user.tag}`);
})

Client.on('message', async (message) => {

    if (!message.guild) return;
    if (message.author.bot) return;

    let RPGADD;
    const con = message.content.toLowerCase();
    RPGADD = await RpgCount.findOne({ author_id: message.author.id, guild_id: message.guild.id });
    if (!RPGADD) {
        RPGADD = await RpgCount.create({ author_id: message.author.id, guild_id: message.guild.id});
        await RPGADD.save();
    }

    if (con.startsWith('rpg')) { //hunt increment
    
        const filter = m => m.author.id == 555955826880413696
        
        const collector = message.channel.createMessageCollector(filter, {
            max: 1,
            time: 15000,
            errors: ['time'],
        })
        
        
        
        collector.on('collect', async msg => {
            
            if (con.includes('hunt')) {
                if (msg.embeds.length) 
                    return;
                if (msg.content.includes("what command are you trying to use?"))
                    return;
                if (msg.content.includes("end your previous command"))
                    return;
                if (msg.content.includes("you can't do this"))
                    return;
                RPGADD.huntcount++;
                await RPGADD.save();
                
            }
            else if ((con.includes('chop') || con.includes('axe') || con.includes('bowsaw') || con.includes('chainsaw') || con.includes('fish') || con.includes('net') || con.includes('boat') || con.includes('bigboat') || con.includes('pickup') || con.includes('ladder') || con.includes('tractor') || con.includes('greenhouse') || con.includes('mine') || con.includes('pickaxe') || con.includes('drill') || con.includes('dynamite'))) {
                if (msg.embeds.length)
                    return ;
                if (msg.content.includes("what command are you trying to use?"))
                    return;
                if (msg.content.includes("end your previous command"))
                    return;
                if (msg.content.includes("you can't do this"))
                    return;
                RPGADD.workcount++;
                await RPGADD.save();

            }
            else if (con.includes('adv') || con.includes('adventure')) {
                if (msg.embeds.length)
                    return;
                if (msg.content.includes("what command are you trying to use?"))
                    return;
                if (msg.content.includes("end your previous command"))
                    return;
                if (msg.content.includes("you can't do this"))
                    return;
                RPGADD.advcount++;
                await RPGADD.save();
            }
            else if (con.includes('farm')) {
                if (msg.embeds.length)
                    return;
                if (msg.content.includes("what command are you trying to use?"))
                    return;
                if (msg.content.includes("end your previous command"))
                    return;
                if (msg.content.includes("you can't do this"))
                    return;
                if (msg.content.includes("what seed are you trying to use?"))
                    return;
                RPGADD.farmcount++;
                await RPGADD.save();
            }
            
            
        })
       
    } 
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'stats') {
        const embed = new Discord.MessageEmbed()
            .setColor(0x00AE86)
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle(`Statistics for ${message.author.username}`)
            .addFields(
                {name: 'Commands', value: `**Hunts**: ${RPGADD.huntcount} | **Worker**: ${RPGADD.workcount} | **Adventure**: ${RPGADD.advcount} | **Farm**: ${RPGADD.farmcount}`, inline: true}
            )
            .setTimestamp()
        message.channel.send({ embed });
    }

    if (command === 'rpgl') {
        
        var mysort = { huntcount: -1 };
        db.collection("rpgcounts").find ({  }).limit(5).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            const embed = new Discord.MessageEmbed()
                .setColor(0x00AE86)
                .setTitle("Leaderboard")
                .setAuthor(Client.user.username, Client.user.displayAvatarURL())
                .setDescription("Today's leaderboard")
                
                for (let i = 0; i < result.length; i++) {
                    let total = result[i].huntcount + result[i].workcount + result[i].advcount + result[i].farmcount;
                    embed.addFields({ name: `#${i+1} | ${Client.users.cache.get(result[i].author_id).tag} | ${total}`, value: `**hunts**: ${result[i].huntcount}\n**worker**: ${result[i].workcount}\n**Adventure**: ${result[i].advcount}\n**Farm**: ${result[i].farmcount}` })
                }
            return message.channel.send(embed);
        });
    }

        
    var task = cron.schedule('0 9 * * *', () => {
        var mysort = { huntcount: -1 };
            db.collection("rpgcounts").find ({  }).limit(5).sort(mysort).toArray(function(err, result) {
                if (err) throw err;
                const lembed = new Discord.MessageEmbed()
                    .setColor(0x00AE86)
                    .setTitle("Leaderboard")
                    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
                    .setDescription("Today's leaderboard")
                
                for (let i = 0; i < result.length; i++) {
                    let total = result[i].huntcount + result[i].workcount + result[i].advcount + result[i].farmcount;
                    lembed.addFields({ name: `#${i+1} | ${Client.users.cache.get(result[i].author_id).tag} | ${total}`, value: `**hunts**: ${result[i].huntcount}\n**worker**: ${result[i].workcount}\n**Adventure**: ${result[i].advcount}\n**Farm**: ${result[i].farmcount}` })
                }
                let lchannel = message.guild.channels.cache.get('788973344891600936')
                lchannel.send(lembed)
            
                },{
                    scheduled: false,
                    timezone: 'Asia/Kolkata'
                });
    });
    task.start();


    if (!message.content.startsWith(prefix)) return;
    
    if (command === 'reset') {
        let staffrole = message.member.roles.cache.find(role => role.id === 'STAFF_ROLE_ID')
        if (staffrole == undefined) 
            return;
        const doc = await RpgCount.updateMany({}, {huntcount: 0, workcount: 0, advcount: 0, farmcount: 0});
        
        message.channel.send('reset');
    }
    

});

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    poolSize: 10
}).then(() => {
    console.log('Connected to Mongodb')
}).catch((err) => {
    console.log('Couldnt connect '+ err )
})
Client.login(token);
