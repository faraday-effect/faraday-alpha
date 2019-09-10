import { Type } from "class-transformer";
import { ClassDay } from "@/types/schedule.types";

export class Topic {
  id = NaN;
  title = "";
  description = "";
  classDay: ClassDay | undefined = undefined;

  constructor(id: number, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }

  setClassDay(classDay: ClassDay) {
    this.classDay = classDay;
  }
}

export class Unit {
  id = NaN;
  title = "";
  description = "";

  @Type(() => Topic)
  topics: Topic[] = [];

  addTopic(topic: Topic) {
    this.topics.push(topic);
  }

  updateTopic(updatedTopic: Topic) {
    const targetTopic = this.topics.find(topic => topic.id === updatedTopic.id);
    if (targetTopic) {
      targetTopic.title = updatedTopic.title;
      targetTopic.description = updatedTopic.description;
    } else {
      throw new Error(`Can't find topic matching ${updatedTopic}`);
    }
  }

  deleteTopic(topicId: number) {
    this.topics = this.topics.filter(topic => topic.id !== topicId);
  }
}
