import { Controller, Get } from "@nestjs/common";
import { arch, platform, release, hostname } from "os";
import { timer } from "rxjs";

interface PingResponse {
  ping: string,
  time: Date,
  hostname: string,
  arch: string,
  platform: string,
  release: string
}

@Controller("telemetry")
export class TelemetryController {
  /**
   * Handle a `ping` request by returning information about the run-time system.
   */
  @Get("ping")
  ping(): PingResponse {
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

function add(a: number, b: number) {
  return a + b;
}

function foo() {
  return add(17, 42);
}
