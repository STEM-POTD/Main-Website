import z from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import type { Problem } from "@prisma/client";

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { name } }) => {
      const team = await ctx.prisma.team.create({
        data: {
          name,
        },
      });

      return team;
    }),

  join: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { teamId } }) => {
      const isFull = await ctx.prisma.team.findFirstOrThrow({
        where: {
          id: teamId,
        },
        select: {
          _count: {
            select: {
              members: true,
            },
          },
        },
      });

      if (isFull._count.members > 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Team is full",
        });
      }

      const team = await ctx.prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return team;
    }),

  leave: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { teamId } }) => {
      const team = await ctx.prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return team;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { teamId } }) => {
      const team = await ctx.prisma.team.delete({
        where: {
          id: teamId,
        },
      });

      return team;
    }),

  all: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany({
      include: {
        members: true,
      },
    });

    return teams;
  }),

  byId: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input: { userId: id } }) => {
      const team = await ctx.prisma.user
        .findFirstOrThrow({
          where: {
            id,
          },
        })
        .team({
          include: {
            members: true,
          },
        });

      return team;
    }),

  problems: publicProcedure
    .input(
      z.object({
        teamId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input: { teamId } }) => {
      const members = await ctx.prisma.team
        .findFirstOrThrow({
          where: {
            id: teamId,
          },
        })
        .members();

      const problems: Problem[] = [];

      for (const member of members) {
        const solved = await ctx.prisma.user
          .findFirstOrThrow({
            where: {
              id: member.id,
            },
          })
          .solved();

        problems.push(...solved);
      }

      return problems;
    }),
});
