import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { SyllabusService } from "./syllabus.service";
import {
  Topic,
  TopicCreateInput,
  TopicUpdateInput,
  Unit,
  UnitCreateInput,
  UnitUpdateInput
} from "./entities";
import { Int } from "type-graphql";
import { AbstractEntity } from "../shared/abstract-entity";

@Resolver(of => Unit)
export class UnitResolver {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Mutation(returns => Unit)
  createUnit(@Args("createInput") createInput: UnitCreateInput) {
    return this.syllabusService.createUnit(createInput);
  }

  @Query(returns => Unit)
  unit(@Args({ name: "id", type: () => Int }) id: number) {
    return this.syllabusService.readOne(Unit, id);
  }

  @Query(returns => [Unit])
  units() {
    return this.syllabusService.readAll(Unit);
  }

  @Mutation(returns => Unit)
  async updateUnit(@Args("updateInput") updateInput: UnitUpdateInput) {
    const unit = await this.syllabusService.findOneOrFail(Unit, updateInput.id);
    unit.title = updateInput.title;
    unit.description = updateInput.description;
    return this.syllabusService.update(unit);
  }

  @Mutation(returns => Unit)
  async deleteUnit(@Args({ name: "id", type: () => Int }) id: number) {
    const unit = await this.syllabusService.findOneOrFail(Unit, id);
    await this.syllabusService.delete(Unit, id);
    return unit;
  }

  @ResolveProperty("topics", type => [Topic])
  resolveTopics(@Parent() unit: Unit) {
    return this.syllabusService.find(Topic, { unit });
  }
}

@Resolver(of => Topic)
export class TopicResolver {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Mutation(returns => Topic)
  createTopic(@Args("createInput") createInput: TopicCreateInput) {
    return this.syllabusService.createTopic(createInput);
  }

  @Query(returns => Topic)
  topic(@Args({ name: "id", type: () => Int }) id: number) {
    return this.syllabusService.readOne(Topic, id);
  }

  @Query(returns => [Topic])
  topics() {
    return this.syllabusService.readAll(Topic);
  }

  @Mutation(returns => Topic)
  async updateTopic(@Args("updateInput") updateInput: TopicUpdateInput) {
    console.log("INPUT", JSON.stringify(updateInput, null, 2));
    const topic = await this.syllabusService.findOneOrFail(
      Topic,
      updateInput.id
    );
    topic.title = updateInput.title;
    topic.description = updateInput.description;
    return this.syllabusService.update(topic);
  }

  @Mutation(returns => Topic)
  async deleteTopic(@Args({ name: "id", type: () => Int }) id: number) {
    const topic = await this.syllabusService.findOneOrFail(Topic, id);
    await this.syllabusService.delete(Topic, id);
    return topic;
  }

  @ResolveProperty("unit", type => Unit)
  resolveUnit(@Parent() topic: Topic) {
    return this.syllabusService.findOneOrFail(Unit, topic.unitId);
  }
}
