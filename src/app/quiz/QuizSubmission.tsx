"use client";
import { useEffect } from "react";
import Bar from "@/components/Bar";
import Image from "next/image";
import { useReward } from "react-rewards";

type Props = {
  scorePercentage: number;
  score: number;
  totoalQuestions: number;
};

const QuizSubmission = (props: Props) => {
  const { scorePercentage, score, totoalQuestions } = props;
  const { reward } = useReward("rewardId", "confetti");

  useEffect(() => {
    if (scorePercentage === 100) {
      reward();
    }
  }, [scorePercentage, reward]);

  return (
    <div className="flex flex-col flex-1">
      <main className="py-1 flex flex-col gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold capitalize">Quiz complete!</h2>
        <p>You scored: {scorePercentage}%</p>
        {scorePercentage === 100 ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <p>Congratulations! 🎊🎉</p>
            <Image
              src="/images/cup.png"
              alt="cup image"
              width={50}
              height={50}
            />
            <span id="rewardId"></span>
          </div>
        ) : (
          <div className="sm:w-200">
            <div className="flex flex-row px-2 justify-between">
              <Bar
                percentage={scorePercentage}
                color="green"
              />
              <Bar
                percentage={100 - scorePercentage}
                color="red"
              />
            </div>
            <div className="flex flex-row gap-8">
              <p>{score} Correct</p>
              <p>{totoalQuestions - score} Incorrect</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizSubmission;
