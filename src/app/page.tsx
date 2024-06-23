import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center text-center">
      <main className="flex flex-col justify-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-[2.5rem]">
          {" "}
          Welcome to Quiz AI
        </h1>
        <div className="flex flex-col items-center justify-start p-5">
          <p className="flex flex-wrap p-1 ">
            The application will help you create quizzes using OpenAI based on
            your document.
          </p>
          <p className="flex flex-col p-1 items-center justify-center">
            Check out the sample quiz or sign in to build custom quizzes.
          </p>
          <Link href={"/quiz"}>
            <Button className="mt-[1rem]">Sample Quiz</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
