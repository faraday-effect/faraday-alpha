import { Term } from "./calendar.types";
import { Type } from "class-transformer";
import { Unit } from "@/types/syllabus.types";

export class Section {
  id = NaN;
  title = "";
  regNumber = "";
  daysOfWeek = "";
  startTime = "";
  stopTime = "";
}

export class Offering {
  id = NaN;
  title = "";
  creditHours = NaN;

  @Type(() => Term)
  term: Term = {} as Term;

  @Type(() => Section)
  sections: Section[] = [];

  @Type(() => Unit)
  units: Unit[] = [];
}

export class Course {
  id = NaN;
  number = "";
  title = "";

  @Type(() => Offering)
  offerings: Offering[] = [];
}
