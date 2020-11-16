const { Client, MessageEmbed } = require("discord.js");
const client = new Client();
const bot = require("./configure.json");
let tickets = new Map();
let categoryID;

client.on("ready", () => {
  console.log("Hey, I am here!!");
  client.user.setActivity("DO ?help");
});

client.on("message", (msg) => {
  if (!msg.content.startsWith(bot.prefix) || msg.author.bot) return;
  if (!msg.guild)
    return msg.channel.send("You must send the message in a server!!");

  const args = msg.content.slice(bot.prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "help") {
    let helpEmbed = new MessageEmbed()
      .setColor("#f68c1f")
      .setTitle("Ticket Bot Help")
      .setDescription(
        "? is the prefix for the bot.. Here is some stuff that this bot can do!!"
      )
      .addFields(
        {
          name: "?openticket",
          value: "To create a new ticket!",
          inline: false,
        },
        {
          name: "?closeticket",
          value: "To close a ticket that was already created by you!",
          inline: false,
        },
        {
          name: "?close (**ADMINS ONLY**)",
          value: "To close an existing ticket created by a different user!!",
          inline: false,
        }
      );

    msg.channel.send(helpEmbed);
  }

  if (command === "openticket") {
    if (tickets.has(`${msg.author.id}${msg.guild}`)) {
      msg.author.send(
        "You already have a ticket open! First close it before opening one, Do `?closeticket` to close the existing one"
      );
    } else {
      let guild = msg.guild;
      msg.channel.send("mhm");
      let name = `${msg.author.username}s ticket`;
      guild.channels
        .create(name, {
          type: "text",
          permissionOverwrites: [
            {
              id: msg.guild.id,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: msg.author.id,
              allow: ["VIEW_CHANNEL"],
            },
          ],
        })
        .then((chl) => {
          tickets.set(`${msg.author.id}${msg.guild}`, chl.id);
          console.log(tickets);
        })
        .catch((err) => console.log(err));
    }
  }

  if (command === "closeticket") {
    if (tickets.has(`${msg.author.id}${msg.guild}`)) {
      let guild = msg.guild;
      client.channels
        .fetch(tickets.get(`${msg.author.id}${msg.guild}`))
        .then((channel) => channel.delete())
        .catch((err) => console.log(err));
      tickets.delete(`${msg.author.id}${msg.guild}`);
      msg.channel.send("mhm");
      console.log(tickets);
    } else {
      msg.author.send(
        "You must have a ticket to close it, so please open a ticket by typing `?openticket`"
      );
    }
  }

  if (command === "close") {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      return msg.author.send(
        "You should be the Admin of the server to run close command!!"
      );
    }
    chnl_id = msg.channel.id;
    tickets.forEach((v, k, m) => {
      if (v == chnl_id) {
        msg.channel.send("mhm");
        tickets.delete(k);
        return client.channels
          .fetch(chnl_id)
          .then((channel) => channel.delete())
          .catch((err) => console.log(err));
      } else {
        return msg.channel.send(
          "This channel is not a ticket.. Try this command in a ticket channel!!"
        );
      }
    });
  }
});

client.login(process.env.token);
