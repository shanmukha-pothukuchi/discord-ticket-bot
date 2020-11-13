const { Client } = require("discord.js");
const client = new Client();
const bot = require("./configure.json");
let tickets = new Map();

client.on("ready", () => {
  console.log("Hey, I am here!!");
  client.user.setActivity(
    "DO ?openticket to open and ?closeticket to close the ticket"
  );
});

client.on("message", (msg) => {
  if (!msg.content.startsWith(bot.prefix) || msg.author.bot) return;

  const args = msg.content.slice(bot.prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "openticket") {
    if (tickets.has(msg.author.id)) {
      msg.author.send(
        "You already have a ticket open! First close it before opening one, Do `?closeticket` to close the existing one"
      );
    } else {
      const guild = msg.guild;
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
          console.log(`Created ${chl.name} channel.`);
          tickets.set(msg.author.id, chl.id);
          console.log(tickets);
        })
        .catch((err) => console.log(err));
    }
  }

  if (command === "closeticket") {
    if (tickets.has(msg.author.id)) {
      let guild = msg.guild;
      client.channels
        .fetch(tickets.get(msg.author.id))
        .then((channel) => channel.delete())
        .catch((err) => console.log(err));
      tickets.delete(msg.author.id);
      msg.channel.send("mhm");
      console.log(tickets);
    } else {
      msg.author.send(
        "You must have a ticket to close it, so please open a ticket by typing `?openticket`"
      );
    }
  }
});

client.login(process.env.token);
