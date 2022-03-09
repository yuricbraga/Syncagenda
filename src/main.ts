import { Environment } from "./helpers/Environment";
import { Twitch } from "./models/Twitch";

const [, , envPath] = process.argv;

Environment.loadVariables(envPath);

if (
  process.env.twitchClientId == null ||
  process.env.twitchClientSecret == null
) {
  throw new Error("Twitch credentials were not provided. Terminating.");
}

const twitch = new Twitch(
  process.env.twitchClientId,
  process.env.twitchClientSecret
);

twitch.authenticate().then((data) => {
  console.log(data);
});
