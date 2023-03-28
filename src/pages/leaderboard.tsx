import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Leaderboard: NextPage = () => {
  const {
    isError,
    error,
    data: users,
    isLoading,
  } = api.user.allByScore.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <main className="flex h-screen flex-col items-center">
      <Head>
        <title>Leaderboard</title>
        <meta name="description" content="Leaderboard" />
      </Head>

      <h1 className="m-4 text-center text-3xl font-bold">Leaderboard</h1>
      <table className="h-auto w-1/3 table-fixed text-center">
        <thead className="m-4 p-8">
          <tr>
            <th className="m-4">Rank</th>
            <th className="m-4">Username</th>
            <th className="m-4">Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr className="p-4" key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Leaderboard;
