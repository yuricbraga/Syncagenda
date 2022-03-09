import { Client, Intents, GuildScheduledEventManager, Guild } from "discord.js";
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case "ping": {
      await interaction.reply("Pong!");
      break;
    }
    case "scheduleretrieve": {
      interaction.deferReply();
      const twitch = new Twitch(twitchClientId, twitchClientSecret);

      let streamerNickname = interaction.options.getString("streamerid");

      if (streamerNickname == null) {
        await interaction.editReply("Couldn't get a schedule!");
        break;
      }

      console.log(streamerNickname);
      const userIdResponse = (await twitch.getTwitchUserId(
        streamerNickname
      )) as any;

      if (userIdResponse.data.length === 0) {
        await interaction.editReply("This user doesn't exist!");
        break;
      }

      const { id: streamerId } = userIdResponse.data[0];
      const schedule = (await twitch.getSchedule(streamerId)) as any;

      console.log(schedule);

      if (Object.keys(schedule).length > 0) {
        if (schedule?.data?.segments == null) {
          await interaction.editReply("This user has no schedule!");
          break;
        }

        schedule.data.segments.map(async (event: any) => {
          console.log(event);
          await interaction.guild?.scheduledEvents.create({
            entityType: "EXTERNAL",
            name: event.title !== "" ? event.title : "No title",
            privacyLevel: "GUILD_ONLY",
            scheduledStartTime: event.start_time,
            scheduledEndTime: event.end_time,
            entityMetadata: {
              location: "https://twitch.tv",
            },
          });
        });
      }

      await interaction.editReply("Schedule applied!");
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
