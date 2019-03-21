const { DataSource } = require("apollo-datasource");

class psqlDataSource extends DataSource {
  constructor(store) {
    super();
    this.store = store;
    this.context = null;
  }

  initialize(config) {
    this.context = config.context;
  }

  async allCourses() {
    console.log("CCC", this.store);
    return await this.store.courses.findAll()
  }
}

module.exports = psqlDataSource;
