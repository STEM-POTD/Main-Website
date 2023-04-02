import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
    .mutation(async ({ ctx, input: { problemId } }) => {
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
    }),

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
        include: {
          solved: true,
        },
      });

      return user;
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id, name } }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return updatedUser;
    }),

  allSolved: protectedProcedure.query(async ({ ctx }) => {
    const solved = await ctx.prisma.problem.findMany({
      where: {
        solvedBy: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });

    return solved;
  }),
});
