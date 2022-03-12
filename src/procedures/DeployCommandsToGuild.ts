import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js/node_modules/discord-api-types/v9";

export class DeployCommandsToGuild {
  clientId: string;
  guildId: string;
  token: string;

  constructor({
    clientId,
    guildId,
    token,
  }: {
    clientId: string;
    guildId?: string;
    token: string;
  }) {
    this.clientId = clientId;
    this.guildId = guildId;
    this.token = token;
  }

  public deploy() {
    const commands = [
      new SlashCommandBuilder()
        .setName("scheduleretrieve")
        .setDescription("Retrieves a Twitch schedule")
        .addStringOption((option) =>
          option
            .setName("streamerid")
            .setDescription("The streamer to retrieve from")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("clearevents")
        .setDescription("Completely clears server events."),
    ].map((command) => command.toJSON());

    const rest = new REST({ version: "9" }).setToken(this.token);

    if (this.guildId) {
      rest
        .put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
          body: commands,
        })
        .then(() => console.log("Commands registered!"))
        .catch(console.error);
    } else {
      rest
        .put(Routes.applicationCommands(this.clientId), { body: commands })
        .then(() => console.log("Commands registered!"))
        .catch(console.error);
    }
  }
}
