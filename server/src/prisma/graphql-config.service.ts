import { Injectable } from "@nestjs/common";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import {
  makePrismaSchema,
  prismaObjectType,
  prismaExtendType
} from "nexus-prisma";
import path from "path";
import datamodelInfo from "../generated/nexus-prisma";
import { prisma } from "../generated/prisma-client";

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  async createGqlOptions(): Promise<GqlModuleOptions> {
    const Query = prismaObjectType({
      name: "Query",
      definition: t => t.prismaFields(["*"])
    });

    const Mutation = prismaObjectType({
      name: "Mutation",
      definition: t => t.prismaFields(["*"])
    });

    const schema = makePrismaSchema({
      types: [Query, Mutation],

      prisma: {
        datamodelInfo,
        client: prisma
      },

      outputs: {
        schema: path.join(__dirname, "../generated/schema.graphql"),
        typegen: path.join(__dirname, "../generated/nexus.ts")
      }
    });

    return {
      debug: true,
      playground: true,
      schema
    };
  }
}
