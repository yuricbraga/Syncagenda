import { readFileSync } from "fs";

export class Environment {
  public static loadVariables(filePath: string) {
    const variables: { [variableName: string]: string } = JSON.parse(
      readFileSync(filePath).toString()
    );

    for (let variable in variables) {
      process.env[variable] = variables[variable];
    }
  }
}
