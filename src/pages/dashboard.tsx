import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import Carousel from "~/utils/Carousel";
import withAuth from "~/utils/withAuth";

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Head>

      <h1>Dashboard</h1>
      <TeamComponent userId={session.user.id} />

      <Link href="/problems">Practice</Link>
    </div>
  );
};

const TeamComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [joinModal, setJoinModal] = useState(false);
  const toggleJoinModal = () => setJoinModal((prev) => !prev);
  const utils = api.useContext();

  const { data: team } = api.team.byId.useQuery({
    userId,
  });

  const { mutate: leaveTeam } = api.team.leave.useMutation({
    onSuccess: () => {
      void utils.team.byId.invalidate({ userId });
    },
  });

  return (
    <>
      {team && (
        <div>
          <h1>Team</h1>
          {team.members.map((member) => (
            <div key={member.id}>
              <p>{member.name}</p>
            </div>
          ))}

          <SolvedShowcase teamId={team.id} />

          <button type="button" onClick={() => leaveTeam({ teamId: team.id })}>
            Leave Team
          </button>
        </div>
      )}
      <div>
        <button type="button" onClick={toggleJoinModal}>
          Join Team
        </button>
        <JoinTeamModal visible={joinModal} userId={userId} />
      </div>
    </>
  );
};

const JoinTeamModal: React.FC<{ visible: boolean; userId: string }> = ({
  visible,
  userId,
}) => {
  const [teamCode, setTeamCode] = useState("");
  const utils = api.useContext();

  const { mutate: joinTeam } = api.team.join.useMutation({
    onSuccess: () => {
      void utils.team.byId.invalidate({ userId });
    },
  });

  const handleJoin = () => {
    joinTeam({ teamId: teamCode });
  };

  return (
    <div className={`${visible ? "block" : "hidden"}`}>
      <input
        type="text"
        value={teamCode}
        onChange={(e) => setTeamCode(e.target.value)}
        placeholder="Team Code"
      />
      <button type="button" onClick={handleJoin}>
        Join
      </button>
    </div>
  );
};

const SolvedShowcase: React.FC<{ teamId: string }> = ({ teamId }) => {
  const { data: solved } = api.team.problems.useQuery({ teamId });

  return (
    <div>
      <h1>Recently Solved: </h1>
      {solved && solved.length > 0 && (
        <Carousel>
          {solved.map((problem) => (
            <div key={problem.id}>
              <h4>{problem.title}</h4>
              <p>{problem.content}</p>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default withAuth(Dashboard);
