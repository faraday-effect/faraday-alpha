import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  public sanityCheck() {
    return "Faraday server is running";
  }
}
