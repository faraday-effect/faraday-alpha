import { Controller, Get } from "@nestjs/common";
import { arch, hostname, platform, release } from "os";

interface PingResponse {
  ping: string;
  time: Date;
  hostname: string;
  arch: string;
  platform: string;
  release: string;
}

@Controller("telemetry")
export class TelemetryController {
  /**
   * Handle a `ping` request by returning information about the run-time system.
   */
  @Get("ping")
  public ping(): PingResponse {
    return {
      ping: "pong",
      time: new Date(),
      hostname: hostname(),
      arch: arch(),
      platform: platform(),
      release: release()
    };
  }
}
