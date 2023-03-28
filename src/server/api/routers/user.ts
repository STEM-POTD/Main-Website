import { z } from "zod";
import type { TRPCError } from "@trpc/server";
import type { User } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

type ResponseType<T, K> =
  | { status: "success"; data: T }
  | { status: "error"; error: K };

export const userRouter = createTRPCRouter({
  allByScore: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      orderBy: {
        score: "desc",
      },
    });

    return users;
  }),

  solveProblem: protectedProcedure
    .input(
      z.object({
        problemId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: { problemId },
      }): Promise<ResponseType<User, TRPCError>> => {
        const problem = await ctx.prisma.problem.findUniqueOrThrow({
          where: {
            id: problemId,
          },
        });

        const updatedUser = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            solved: {
              connect: {
                id: problemId,
              },
            },
            score: {
              increment: problem.score,
            },
          },
        });

        return {
          data: updatedUser,
          status: "success",
        };
      }
    ),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return user;
    }),
});
