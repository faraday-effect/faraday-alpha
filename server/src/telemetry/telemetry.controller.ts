import { Controller, Get } from "@nestjs/common";
import { arch, platform, release, hostname } from "os";

@Controller("telemetry")
export class TelemetryController {
  @Get("ping")
  ping() {
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
