import { Fetch } from "./Fetch";

export class Twitch {
  clientId: string;
  clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async authenticate(): Promise<any> {
    return await Fetch.post("id.twitch.tv/oauth2/token", {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
      },
    });
  }

  async getSchedule(broadcasterId: string) {
    const { access_token } = await this.authenticate();

    return await Fetch.get("api.twitch.tv/helix/schedule", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Client-id": this.clientId,
      },
      params: {
        broadcaster_id: broadcasterId,
      },
    });
  }

  async getTwitchUserId(login: string) {
    const { access_token } = await this.authenticate();

    return await Fetch.get("api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Client-id": this.clientId,
      },
      params: {
        login,
      },
    });
  }
}
