import { Fetch } from "./Fetch";

export class Twitch {
  clientId: string;
  clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async authenticate() {
    return await Fetch.post("id.twitch.tv/oauth2/token", {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
      },
    });
  }
}
