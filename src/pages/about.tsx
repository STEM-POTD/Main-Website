import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Carousel from "~/utils/Carousel";

const About: NextPage = () => {
  const newsItems = [
    {
      title: "STEM POTD",
      date: "11/12/22",
      description:
        "STEM POTD is proud to announce our first math competition! Expect cash-prizes, challenging problems, and a great time.",
    },
    {
      title: "STEM POTD 2",
      date: "11/12/22",
      description:
        "STEM POTD is proud to announce our first math competition! Expect cash-prizes, challenging problems, and a great time.",
    },
    {
      title: "STEM POTD 3",
      date: "11/12/22",
      description:
        "STEM POTD is proud to announce our first math competition! Expect cash-prizes, challenging problems, and a great time.",
    },
  ];

  return (
    <>
      <Head>
        <title>News</title>
        <meta name="description" content="News" />
      </Head>
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="text-4xl font-bold">Latest News</h2>
        <p>What&apos;s going on?</p>
        <section className="m-4 flex items-center justify-center">
          <Carousel className="h-fit w-1/3 rounded-2xl bg-tan p-10 drop-shadow-2xl">
            {newsItems.map((item, index) => (
              <CarouselItem key={index} item={item} />
            ))}
          </Carousel>
        </section>
      </section>
    </>
  );
};

const CarouselItem: React.FC<{
  item: { title: string; description: string; date: string };
}> = ({ item }) => {
  return (
    <>
      <Image
        src={"/images/features-icon-1.png"}
        alt=""
        width={100}
        height={100}
      />
      <div className="my-2 py-4">
        <h4 className=" text-2xl font-black">{item.title}</h4>
        <p>{item.description}</p>
        <p>Takes place: {item.date}</p>
      </div>
      <Link
        href="/news"
        className="rounded-full bg-nav-yellow py-3 px-4 font-bold hover:bg-white hover:text-slate-800"
        replace
      >
        Read More
      </Link>
    </>
  );
};

export default About;
