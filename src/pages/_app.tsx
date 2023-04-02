import { type AppType } from "next/app";
import Link from "next/link";

import { type Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { MathJaxContext } from "better-react-mathjax";
import config from "~/utils/MathJaxConfig";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <MathJaxContext version={3} config={config}>
      <SessionProvider session={session}>
        <HeaderComponent />
        <Component {...pageProps} />
        <FooterComponent />
      </SessionProvider>
    </MathJaxContext>
  );
};
const HeaderComponent: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-center bg-nav-yellow">
      <Link
        href="/"
        className="absolute left-0 mx-4 text-3xl font-black transition-opacity ease-linear hover:opacity-50"
      >
        STEM POTD
      </Link>
      <nav className="flex h-full w-full items-center justify-center">
        <div className="flex space-x-4 font-light">
          <Link className="hover:text-blue-700" id={"home"} href="/">
            Home
          </Link>
          <Link className="hover:text-blue-700" id={"news"} href="/about">
            News
          </Link>
          <Link className="hover:text-blue-700" id={"team"} href="/team">
            About
          </Link>
          <button
            type="button"
            id={"auth"}
            onClick={() => {
              session
                ? void signOut({ callbackUrl: "/" })
                : void signIn("google", { callbackUrl: "/" });
            }}
            className="hover:text-blue-700"
          >
            {session ? "Sign Out" : "Sign In"}{" "}
          </button>
          {/* {!session ? (
            <>
              <Link className="hover:text-blue-700" id={"login"} href="/login">
                Sign In
              </Link>

             <Link
                className="hover:text-blue-700"
                id={"register"}
                href="/register"
              >
                Register User
              </Link> 
            </>
          ) : (
            
          )} */}

          {session && (
            <Link
              className="hover:text-blue-700"
              id={"dashboard"}
              href="/dashboard"
            >
              Dashboard
            </Link>
          )}

          <Link
            className="hover:text-blue-700"
            id={"leaderboard"}
            href="/leaderboard"
          >
            Leaderboard
          </Link>
        </div>
      </nav>
    </header>
  );
};

const FooterComponent: React.FC = () => {
  return (
    <footer id="contact-us" className="my-10 p-4 text-center">
      <p>
        Copyright &copy; 2020 Lava Landing Page | Designed by{" "}
        <a rel="nofollow" href="https://templatemo.com">
          TemplateMo
        </a>
      </p>
    </footer>
  );
};

export default api.withTRPC(MyApp);
