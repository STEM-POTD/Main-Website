import type { Problem } from ".prisma/client";
import MathJax from "better-react-mathjax/MathJax";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

const Problems: NextPage = () => {
  const [shouldFetch, setShouldFetch] = useState(true);
  const [visibileIndex, setVisibleIndex] = useState(1);

  const { data: problems, isLoading } = api.problems.getProblems.useQuery(
    undefined,
    {
      enabled: shouldFetch,
      onSuccess: () => setShouldFetch(false),
    }
  );

  const { mutate: solve } = api.user.solveProblem.useMutation();

  return (
    <section className="h-screen">
      <Head>
        <title>Practice Problems</title>
        <meta name="description" content="Practice Problems" />
      </Head>
      <h1 className="m-4 p-4 text-center text-3xl font-bold">
        Practice Problems
      </h1>
      {isLoading && <p>Loading...</p>}
      {problems?.length === 0 && (
        <div className="flex w-full flex-row justify-center ">
          <p className="w-1/3 text-center text-xl font-medium">
            No problems found! Either you&apos;ve solved all of them or there
            aren&apos;t any left to solve. Check back later!
          </p>
        </div>
      )}
      {problems?.slice(0, visibileIndex).map((problem) => (
        <div className="w-1/3" id={problem.id} key={problem.id}>
          <div className="m-4 w-fit rounded-3xl">
            <PracticeProblem
              problem={problem}
              onCorrect={() => {
                setVisibleIndex((prev) => prev + 1);
                solve({
                  problemId: problem.id,
                });
              }}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

const PracticeProblem: React.FC<{
  problem: Problem;
  onCorrect: () => void;
}> = ({ problem: { title, content, answer: correctAnswer }, onCorrect }) => {
  const answerState = {
    CORRECT: "bg-green-500",
    INCORRECT: "bg-red-500",
    UNANSWERED: "bg-gradient-to-br from-indigo-500 to-red-400",
  } as const;

  type AnswerState = (typeof answerState)[keyof typeof answerState];

  const [answeredState, setAnsweredState] = useState<AnswerState>(
    answerState.UNANSWERED
  );

  const handleAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(data.entries());

    const safeAnswer = z
      .object({
        answer: z.string(),
      })
      .safeParse(dataObj);

    if (!safeAnswer.success) {
      console.log("error: ", safeAnswer.error);
      alert(safeAnswer.error.issues[0]?.message);
      return;
    }

    const { answer: answerString } = safeAnswer.data;

    if (answerString !== correctAnswer) {
      console.log("incorrect");
      setAnsweredState(answerState.INCORRECT);
      return;
    }

    setAnsweredState(answerState.CORRECT);
    onCorrect();
  };

  return (
    <>
      <div className={`rounded-3xl bg-gradient-to-br ${answeredState} p-4`}>
        {/* <div className="rounded-3xl bg-red-500 p-4"> */}
        <h2 className="font-bold">{title}</h2>
        <MathJax>{content}</MathJax>
        <label htmlFor="answer" className="mt-4 font-bold">
          Answer
        </label>
        <form className="flex rounded-md" onSubmit={handleAnswer}>
          <input
            type="text"
            name="answer"
            id="answer"
            className="block w-full flex-1 rounded-md border-gray-300 text-center focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            autoFocus
            autoComplete="off"
            disabled={answeredState === answerState.CORRECT}
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-l-md px-3 text-sm"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Problems;
