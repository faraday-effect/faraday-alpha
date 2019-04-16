import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  sanityCheck() {
    return "Faraday server is running";
  }
}
