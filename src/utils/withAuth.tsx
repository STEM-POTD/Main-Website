import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = <T extends object>(Component: NextPage<T>) => {
  const AuthedComponent = (props: T) => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        void router.push("/login");
      }
    }, [status, router]);

    return <Component {...props} />;
  };

  return AuthedComponent;
};

export default withAuth;
