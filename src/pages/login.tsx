import type { NextPage } from "next";
import { signIn } from "next-auth/react";

const Login: NextPage = () => {
  return (
    <div>
      <button
        type="button"
        onClick={() => void signIn("google", { callbackUrl: "/" })}
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
