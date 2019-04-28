// ----- SECTION SERVICE -----

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Section,
  SectionCreateInput,
  SectionWhereUniqueInput,
  SectionWhereInput,
  SectionOrderByInput,
  SectionUpdateInput
} from "./section.entity";

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>
  ) {}

  // Create
  async createSection(data: SectionCreateInput) {
    const newSection = this.sectionRepository.create(data);
    return await this.sectionRepository.save(newSection);
  }

  async upsertSection(args: {
    where: SectionWhereUniqueInput;
    create: SectionCreateInput;
    update: SectionUpdateInput;
  }) {}

  // Read
  async section(where: SectionWhereUniqueInput) {
    return await this.sectionRepository.findOne(where);
  }

  async sections(args?: {
    where?: SectionWhereInput;
    orderBy?: SectionOrderByInput;
    skip?: number;
    take?: number;
  }) {
    return await this.sectionRepository.find(args.where);
  }

  // Update
  async updateSection(args: {
    data: SectionUpdateInput;
    where: SectionWhereUniqueInput;
  }) {}

  async updateManySections(args: {
    data: SectionUpdateInput;
    where?: SectionWhereInput;
  }) {}

  // Delete
  async deleteSection(where: SectionWhereUniqueInput) {}

  async deleteManySections(where?: SectionWhereInput) {}
}
