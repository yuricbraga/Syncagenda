import { Client, Intents, GuildScheduledEventManager, Guild } from "discord.js";
import { Environment } from "./helpers/Environment";
import { Twitch } from "./models/Twitch";
import { DiscordInterations } from "./modules/DiscordInteractions";
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
  !twitchClientId ||
  !twitchClientSecret
) {
  throw new Error("Not all variables were provided. Terminating.");
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const deployCommandsToGuild = new DeployCommandsToGuild({
  clientId: discordBotClientId,
  guildId: testGuildId,
  token: discordBotToken,
});
deployCommandsToGuild.deploy();

const discordInteractions = new DiscordInterations(
  twitchClientId,
  twitchClientSecret
);

client.once("ready", () => {
  console.log("Bot is ready.");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    discordInteractions[commandName](interaction);
  } catch (e) {
    await interaction.editReply(e);
  }
});

client.login(discordBotToken);
