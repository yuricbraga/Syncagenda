import { CommandInteraction } from "discord.js";
import { Twitch } from "../models/Twitch";

export class DiscordInterations {
  private twitch: Twitch;

  constructor(twitchClientId: string, twitchClientSecret: string) {
    this.twitch = new Twitch(twitchClientId, twitchClientSecret);
  }

  public async scheduleretrieve(interaction: CommandInteraction) {
    await interaction.deferReply();

    try {
      let streamerNickname = interaction.options.getString("streamerid");

      if (streamerNickname == null)
        throw { status: 404, message: "Couldn't get a schedule!" };

      const userIdResponse = (await this.twitch.getTwitchUserId(
        streamerNickname
      )) as any;

      if (userIdResponse.data.length === 0)
        throw { status: 404, message: "This user doesn't exist!" };

      const { id: streamerId } = userIdResponse.data[0];
      const schedule = (await this.twitch.getSchedule(streamerId)) as any;

      if (Object.keys(schedule).length > 0) {
        if (schedule?.data?.segments == null) {
          throw { status: 404, message: "This user has no schedule!" };
        }

        for (let event of schedule.data.segments) {
          // Create events without waiting
          interaction.guild?.scheduledEvents.create({
            entityType: "EXTERNAL",
            name: event.title !== "" ? event.title : "No title",
            privacyLevel: "GUILD_ONLY",
            scheduledStartTime: event.start_time,
            scheduledEndTime: event.end_time,
            entityMetadata: {
              location: `https://twitch.tv/${streamerNickname}`,
            },
          });
        }
      }

      await interaction.editReply("Schedule is being applied!");
    } catch (e: any) {
      if (!e.status) throw "Unknown error";
      await interaction.editReply(e.message);
    }
  }

  public async clearevents(interaction: CommandInteraction) {
    await interaction.deferReply();
    const events = await interaction.guild?.scheduledEvents.fetch();

    if (events)
      for (let event of events?.toJSON())
        if (event.entityMetadata["location"]?.includes("twitch"))
          interaction.guild?.scheduledEvents.delete(event);

    await interaction.editReply("Your Discord agenda is being cleared!");
  }
}
