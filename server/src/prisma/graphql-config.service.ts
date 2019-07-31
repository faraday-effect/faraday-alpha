import { Injectable } from "@nestjs/common";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { stringArg, booleanArg } from "nexus";
import { makePrismaSchema, prismaObjectType } from "nexus-prisma";
import path from "path";
import datamodelInfo from "../generated/nexus-prisma";
import { prisma } from "../generated/prisma-client";
import {
  QuestionType,
  TrueFalseQuestion,
  FillOneBlankQuestion
} from "../../../designer/src/components/quiz/quiz.types";

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  async createGqlOptions(): Promise<GqlModuleOptions> {
    // @ts-ignore: Expression produces a union type that is too complex to represent.
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
            text: stringArg({ required: true }),
            answer: booleanArg({ required: true })
          },
          resolve: (_obj, { title, text, answer }, ctx) => {
            const q: TrueFalseQuestion = {
              type: QuestionType.TrueFalse,
              title,
              text,
              details: { answer }
            };
            return ctx.prisma.createQuizQuestion(q);
          }
        });

        t.field("createFillOneBlankQuestion", {
          type: "QuizQuestion",
          args: {
            title: stringArg({ required: true }),
            text: stringArg({ required: true }),
            textAnswers: stringArg({ required: false, list: true }),
            regexpAnswers: stringArg({ required: false, list: true })
          },
          resolve: (_obj, { title, text, textAnswers, regexpAnswers }, ctx) => {
            const q: FillOneBlankQuestion = {
              type: QuestionType.FillOneBlank,
              title,
              text,
              details: {
                answer: {
                  text: textAnswers,
                  regexp: regexpAnswers
                }
              }
            };
            return ctx.prisma.createQuizQuestion(q);
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
