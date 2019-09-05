export class Topic {
  id = NaN;
  title = "";
  description = "";
}

export class Unit {
  id = NaN;
  title = "";
  description = "";
  topics: Topic[] = [];
}
