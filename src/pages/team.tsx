import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Carousel from "~/utils/Carousel";
import testimonials from "~/utils/testimonials";

const Team: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="About the Team" />
      </Head>
      <section className="flex h-full flex-col items-center justify-center pt-[10%]">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold">Meet the Team</h2>
          <p>Our staff</p>
        </div>
        <div className="h-full">
          <Carousel className="h-fit w-1/2 rounded-2xl bg-tan bg-gradient-to-br p-10 drop-shadow-2xl">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} testimonial={testimonial} />
            ))}
          </Carousel>
        </div>
      </section>
    </>
  );
};

const Testimonial: React.FC<{
  testimonial: (typeof testimonials)[number];
}> = ({ testimonial }) => {
  return (
    <>
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <i>
          <Image
            src={"/images/testimonial-author-1.png"}
            alt={testimonial.altText}
            width={100}
            height={100}
          />
        </i>
      </div>
      <div className="testimonial-content">
        <ul className="flex flex-row items-center justify-center text-white">
          {Array.from(Array(testimonial.stars).keys()).map((star) => (
            <li key={star} className="bg-transparent text-white">
              &#11088;
            </li>
          ))}
        </ul>
        <h4>{testimonial.name}</h4>
        <p>{testimonial.description}</p>
        <span>{testimonial.title}</span>
      </div>
    </>
  );
};

export default Team;
