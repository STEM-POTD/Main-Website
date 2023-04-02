import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";
import withAuth from "~/utils/withAuth";
import type { Problem } from "@prisma/client";
import Carousel from "~/utils/Carousel";
import MathJax from "better-react-mathjax/MathJax";

interface ModalProps {
  visible: boolean;
  userId: string;
  toggle: () => void;
}

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Head>
      <section className="mt-10 grid h-screen w-full grid-cols-2 grid-rows-2 justify-items-center">
        <div>
          <TeamComponent userId={session.user.id} />
        </div>
        <div>
          <ProfileComponent userId={session.user.id} />
        </div>
        <div className="col-span-2">
          <ProblemShowcase userId={session.user.id} />
          <Link href="/problems">Practice</Link>
        </div>
      </section>
    </>
  );
};

const ProfileComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: user } = api.user.byId.useQuery({
    id: userId,
  });
  const utils = api.useContext();

  const { mutate: updateName } = api.user.updateName.useMutation({
    onSuccess: () => {
      setNewName("");
      void utils.user.byId.invalidate({ id: userId });
    },
  });

  const [newName, setNewName] = useState(user?.name ?? "");

  return (
    <>
      <h1 className="text-center font-bold">Profile</h1>
      <div className="flex flex-row p-2">
        {user?.image && (
          <div className="relative mx-4 mb-2 h-20 w-20 rounded-full">
            <Image
              src={user.image}
              alt="Profile Picture"
              fill
              className="rounded-full object-fill"
            />
          </div>
        )}

        <p>{user?.name}</p>
      </div>
      <form className="space-x-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          placeholder="New Name"
        />
        <button
          type="button"
          onClick={() => updateName({ id: userId, name: newName })}
        >
          Update
        </button>
      </form>
    </>
  );
};

const TeamComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [joinModal, setJoinModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  const toggleCreateModal = () => setCreateModal((prev) => !prev);
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
      <h1 className="text-center font-bold">Team</h1>
      {!team && (
        <div>
          <p className="text-center">You are not in a team</p>
        </div>
      )}
      {team && (
        <div>
          {team.members.map((member) => (
            <div key={member.id}>
              <p>{member.name}</p>
            </div>
          ))}

          <button type="button" onClick={() => leaveTeam({ teamId: team.id })}>
            Leave Team
          </button>
        </div>
      )}
      <>
        <div className="flex flex-initial flex-row justify-center">
          <button
            type="button"
            onClick={toggleJoinModal}
            className="mx-1 rounded-full bg-blue-400 py-2 px-3 transition-opacity ease-in-out hover:opacity-50"
          >
            Join Team
          </button>
          <button
            type="button"
            className="mx-1 rounded-full bg-emerald-400 py-2 px-3 transition-opacity ease-in-out hover:opacity-50"
            onClick={toggleCreateModal}
          >
            Create Team
          </button>
        </div>
        <JoinTeamModal
          visible={joinModal}
          userId={userId}
          toggle={toggleJoinModal}
        />
        <CreateTeamModal
          visible={createModal}
          userId={userId}
          toggle={toggleCreateModal}
        />
      </>
    </>
  );
};

const CreateTeamModal: React.FC<ModalProps> = ({ visible, userId, toggle }) => {
  const [teamName, setTeamName] = useState("");
  const utils = api.useContext();

  const { mutate: createTeam } = api.team.create.useMutation({
    onSuccess: () => {
      void utils.team.byId.invalidate({ userId });
      void utils.user.byId.invalidate({ id: userId });
      toggle();
    },
  });

  const handleCreate = () => createTeam({ name: teamName });

  return (
    <div className={`${visible ? "block" : "hidden"} mt-10 space-x-2`}>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Team Name"
      />
      <button type="button" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
};

const JoinTeamModal: React.FC<ModalProps> = ({ visible, userId, toggle }) => {
  const [teamCode, setTeamCode] = useState("");
  const utils = api.useContext();

  const { mutate: joinTeam } = api.team.join.useMutation({
    onSuccess: () => {
      void utils.team.byId.invalidate({ userId });
      toggle();
    },
  });

  const handleJoin = () => {
    joinTeam({ teamId: teamCode });
  };

  return (
    <div className={`${visible ? "block" : "hidden"} mt-10 space-x-2`}>
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

const ProblemShowcase: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: team } = api.team.byId.useQuery({ userId });
  const { data: user } = api.user.byId.useQuery(
    { id: userId },
    { enabled: !team }
  );

  const showcase = new Set<Problem>();

  (team?.members ?? (user ? [user] : [])).forEach((member) => {
    member.solved.forEach((problem) => {
      showcase.add(problem);
    });
  });

  return (
    <>
      <h1 className="text-center font-bold">Recently Solved: </h1>

      {showcase.size > 0 && (
        <div className="w-1/3">
        <Carousel>
            {Array.from(showcase).map(({ id, title, content }) => (
              <div
                className="w-full rounded-3xl bg-gradient-to-br from-indigo-500 to-red-400 p-4"
                key={id}
              >
                <h2 className="font-bold">{title}</h2>
                <MathJax>{content}</MathJax>
              </div>
            ))}
        </Carousel>
        </div>
      )}
    </>
  );
};

export default withAuth(Dashboard);
