const os = require("os");

const userResolvers = require("./user");
const courseResolvers = require("./course");

const pingPongResolvers = {
  Query: {
    ping: () => ({
      arch: os.arch(),
      cpus: os.cpus().map(cpu => cpu.model),
      platform: os.platform(),
      release: os.release(),
      hostname: os.hostname()
    })
  }
}

module.exports = [pingPongResolvers, userResolvers, courseResolvers];
