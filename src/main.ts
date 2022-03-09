import { Client, Intents } from "discord.js";
import { Environment } from "./helpers/Environment";
import { Twitch } from "./models/Twitch";
import { DeployCommandsToGuild } from "./procedures/DeployCommandsToGuild";

const [, , envPath] = process.argv;

Environment.loadVariables(envPath);

const {
  discordBotClientId,
  discordBotToken,
  testGuildId,
  twitchClientId,
  twitchClientSecret,
} = process.env;

if (
  !discordBotClientId ||
  !discordBotToken ||
  !testGuildId ||
  !twitchClientId ||
  !twitchClientSecret
) {
  throw new Error("Not all variables were provided. Terminating.");
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const deployCommandsToGuild = new DeployCommandsToGuild(
  discordBotClientId,
  testGuildId,
  discordBotToken
);
deployCommandsToGuild.deploy();

client.once("ready", () => {
  console.log("Bot is ready.");
});

client.on("interactionCreate", async (interation) => {
  if (!interation.isCommand()) return;

  const { commandName } = interation;

  switch (commandName) {
    case "ping": {
      await interation.reply("Pong!");
      break;
    }
    case "scheduleretrieve": {
      const twitch = new Twitch(twitchClientId, twitchClientSecret);

      let streamerId = interation.options.getString("streamerid");

      if (streamerId == null) {
        await interation.reply("Couldn't get a schedule!");
        break;
      }

      const schedule = await twitch.getSchedule(streamerId);

      await interation.reply(JSON.stringify(schedule, null, 2));
      break;
    }
  }
});

client.login(discordBotToken);

/*
const twitch = new Twitch(twitchClientId, twitchClientSecret);

twitch.authenticate().then((data) => {
  console.log(data);
});
*/
