import { Test, TestingModule } from "@nestjs/testing";
import { TelemetryController } from "../telemetry.controller";

describe("Telemetry Controller", () => {
  let controller: TelemetryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryController]
    }).compile();

    controller = module.get<TelemetryController>(TelemetryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should pong a ping", () => {
    expect(controller.ping()).toHaveProperty("platform");
  });
});
