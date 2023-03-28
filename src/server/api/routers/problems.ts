import { createTRPCRouter, protectedProcedure } from "../trpc";

export const problemsRouter = createTRPCRouter({
  getProblems: protectedProcedure.query(async ({ ctx }) => {
    // Get all the problems that the user has not solved
    const problems = await ctx.prisma.problem.findMany({
      orderBy: { id: "asc" },
      where: {
        NOT: {
          solvedBy: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      },
    });

    return problems;
  }),
});
