import { request, RequestOptions } from "https";

export class Fetch {
  public static async get(
    url: string,
    {
      headers,
      params,
    }: {
      headers?: { [attr: string]: string | number };
      params?: { [attr: string]: string };
    }
  ) {
    return new Promise((resolve, reject) => {
      if (headers == null) headers = {};

      const [hostname, ...pathSplited] = url.split("/");
      let path = pathSplited.length > 0 ? `/${pathSplited.join("/")}` : "";

      if (params != null) {
        path = `${path}?${Object.keys(params)
          .map((attrName) => `${attrName}=${params[attrName]}`)
          .join("&")}`;
      }

      const options: RequestOptions = {
        hostname,
        method: "GET",
        path,
        headers,
      };

      const req = request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on("error", (e) => {
        reject(e);
      });

      req.end();
    });
  }

  public static async post(
    url: string,
    {
      headers,
      params,
      body,
    }: {
      headers?: { [attr: string]: string | number };
      params?: { [attr: string]: string };
      body?: { [attr: string]: any };
    }
  ) {
    return new Promise((resolve, reject) => {
      if (headers == null) headers = {};

      const [hostname, ...pathSplited] = url.split("/");
      let path = pathSplited.length > 0 ? `/${pathSplited.join("/")}` : "";

      if (params != null) {
        path = `${path}?${Object.keys(params)
          .map((attrName) => `${attrName}=${params[attrName]}`)
          .join("&")}`;
      }

      const postData = body ? JSON.stringify(body) : "";
      headers = {
        ...headers,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      };

      const options: RequestOptions = {
        hostname,
        method: "POST",
        path,
        headers,
      };

      const req = request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on("error", (e) => {
        reject(e);
      });

      req.write(postData);
      req.end();
    });
  }
}
