import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div
      className="flex h-screen w-full flex-col bg-banner-image bg-contain bg-right-top bg-no-repeat"
      id="welcome"
    >
      <Head>
        <title>STEM POTD</title>
        <meta name="description" content="STEM POTD" />
      </Head>

      <div className="ml-10 mt-[20%] w-1/3">
        <h1 className="mb-8 text-5xl font-black">STEM POTD</h1>
        <p className="mb-10 text-lg">
          An organization dedicated to writing, teaching, and challenging the
          next generation of curious learners.
        </p>
        <Link
          href="/news"
          className="rounded-full bg-nav-yellow py-4 px-5 font-bold transition-all ease-in-out hover:bg-white hover:text-slate-800"
        >
          Latest News
        </Link>
      </div>
    </div>
  );
};

export default Home;
