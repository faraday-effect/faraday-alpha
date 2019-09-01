import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { BaseService } from "../shared/base.service";

@Injectable()
export class CatalogService extends BaseService {
  constructor(protected readonly entityManager: EntityManager) {
    super(entityManager);
  }
}
