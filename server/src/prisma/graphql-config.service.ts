import { Injectable } from "@nestjs/common";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { stringArg } from "nexus";
import { makePrismaSchema, prismaObjectType } from "nexus-prisma";
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
      definition(t) {
        t.prismaFields(["*"]);

        t.field("createTrueFalseQuestion", {
          type: "QuizQuestion",
          args: {
            title: stringArg({ required: true }),
            text: stringArg({ required: true })
          },
          resolve: (_obj, { title, text }, ctx) => {
            return ctx.prisma.createQuizQuestion({
              type: "true-false",
              title,
              text,
              details: { alpha: 17 }
            });
          }
        });
      }
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
      },

      typegenAutoConfig: {
        sources: [
          {
            source: path.join(__dirname, "./types.ts"),
            alias: "types"
          }
        ],
        contextType: "types.Context"
      }
    });

    return {
      debug: true,
      playground: true,
      schema,
      context: { prisma }
    };
  }
}
