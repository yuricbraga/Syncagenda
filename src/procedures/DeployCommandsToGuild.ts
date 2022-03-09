import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js/node_modules/discord-api-types/v9";

export class DeployCommandsToGuild {
  clientId: string;
  guildId: string;
  token: string;

  constructor(clientId: string, guildId: string, token: string) {
    this.clientId = clientId;
    this.guildId = guildId;
    this.token = token;
  }

  public deploy() {
    const commands = [
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong"),
      new SlashCommandBuilder()
        .setName("scheduleretrieve")
        .setDescription("Retrieves a Twitch schedule")
        .addStringOption((option) =>
          option
            .setName("streamerid")
            .setDescription("The streamer to retrieve from")
            .setRequired(true)
        ),
    ].map((command) => command.toJSON());

    const rest = new REST({ version: "9" }).setToken(this.token);

    rest
      .put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
        body: commands,
      })
      .then(() => console.log("Commands registered!"))
      .catch(console.error);
  }
}
