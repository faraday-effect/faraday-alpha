import { Command } from "@oclif/command";
import HttpClient from "../http-client";
import { table } from "table";
import * as _ from "lodash";
import chalk from "chalk";
import * as figlet from "figlet";

export default class Telemetry extends Command {
  static description = "Faraday server status";

  static args = [
    {
      name: "action",
      required: true,
      options: ["ping"]
    }
  ];

  async run() {
    const { args } = this.parse(Telemetry);
    const http = new HttpClient();
    const result = await http.get("telemetry/ping");
    const headers = ["Field", "Value"].map(s => chalk.greenBright(s));
    const data = [[...headers], ..._.toPairs(result)];
    const options = {
      drawHorizontalLine: (index: number, size: number) => {
        return index === 0 || index === 1 || index === size;
      }
    };
    console.log(figlet.textSync('microFaraday'));
    console.log(table(data, options));
  }
}
