"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizSubmission from "./QuizSubmission";
import { InferSelectModel } from "drizzle-orm";
import {
  answers,
  answers as dbAnswers,
  questions as dbQuestions,
  quizzes,
} from "@/db/schema";

import { saveSubmission } from "../actions/saveSubmissions";

import { useRouter } from "next/navigation";

type dbAnswer = InferSelectModel<typeof dbAnswers>;
type dbQuestion = InferSelectModel<typeof dbQuestions> & {
  answers: dbAnswer[];
};
type Quiz = InferSelectModel<typeof quizzes> & { questions: dbQuestion[] };

type Props = {
  quiz: Quiz;
};

export default function QuizQuestions(props: Props) {
  const { questions } = props.quiz;
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: number; answerId: number }[]
  >([]);
  const [submiited, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const handleNext = () => {
    //when the quiz is not started we use Start button to start the quiz and then below we set the state as started and return because once we start the quiz, the button name is change to Next and this function will perform action for Next button
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }
  };

  const handleAnswer = (answer: dbAnswer, questionId: number) => {
    const newUserAnswersArr = [
      ...userAnswers,
      {
        answerId: answer.id,
        questionId,
      },
    ];
    setUserAnswers(newUserAnswersArr);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
  };

  const handlePressPrev = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion - 1);
    }
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  const handleSubmit = async () => {
    console.log(currentQuestion, questions.length - 1);
    try {
      await saveSubmission({ score }, props.quiz.id);
    } catch (e) {
      console.log(e);
    }
    setSubmitted(true);
  };

  const scorePercentage: number = Math.round((score / questions.length) * 100);
  const selectedAnswer: number | null | undefined = userAnswers.find(
    (item) => item.questionId === questions[currentQuestion].id
  )?.answerId;

  //here if the correct answer is at index 0 then questions[currentQuestion].answers.findIndex((answer) => answer.id === selectedAnswer) will return 0 but in Javascript 0 is false.
  //so if we write questions[currentQuestion].answers.findIndex((answer) => answer.id === selectedAnswer) ? "true" : "false", then for the answers at index 0 will give "false". Therefore we need to explicity check if index is -1. questions[currentQuestion].answers.findIndex((answer) => answer.id === selectedAnswer) gives -1 when the selected answer is not present in the answers array.

  const isCorrect: boolean | null | undefined =
    questions[currentQuestion].answers.findIndex(
      (answer) => answer.id === selectedAnswer
    ) !== -1
      ? questions[currentQuestion].answers.find(
          (answer) => answer.id === selectedAnswer
        )?.isCorrect
      : null;

  if (submiited) {
    return (
      <QuizSubmission
        score={score}
        scorePercentage={scorePercentage}
        totoalQuestions={questions.length}
      />
    );
  }

  return (
    <div className="flex flex-col p-2">
      <div className="position-sticky top-0 z-10 shadow-md w-full pb-2">
        <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePressPrev}
          >
            <ChevronLeft />
          </Button>
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button
            size="icon"
            variant="outline"
            onClick={handleExit}
          >
            <X />
          </Button>
        </header>
      </div>
      <main className="flex flex-col">
        {!started ? (
          <h1 className="text-xl sm:text-3xl font-bold text-center mb-[5rem]">
            Welcome to your Quiz
          </h1>
        ) : (
          <div>
            <h2 className="text-lg sm:text-xl font-bold mt-1">
              {questions[currentQuestion].questionText}
            </h2>
            <div className="flex flex-col gap-4  mt-6">
              {questions[currentQuestion].answers.map((answer) => {
                const variant =
                  selectedAnswer == answer.id
                    ? answer.isCorrect
                      ? "neoSuccess"
                      : "neoDanger"
                    : "neoOutline";
                return (
                  <div className="mb-2">
                    <Button
                      key={answer.id}
                      disabled={!!selectedAnswer}
                      variant={variant}
                      size={"sm"}
                      onClick={() =>
                        handleAnswer(answer, questions[currentQuestion].id)
                      }
                      className="disabled:opacity-100"
                    >
                      <p className="whitespace-normal">{answer.answerText}</p>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className="footer flex flex-col justify-center  text-center sm:items-center mt-10 p-1">
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={
            questions[currentQuestion].answers.find(
              (answer) => answer.isCorrect === true
            )?.answerText || ""
          }
        />
        {started && currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            size="lg"
            variant="neo"
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            size="lg"
            variant="neo"
            className="font-bold"
          >
            {!started ? "Start" : "Next"}
          </Button>
        )}
      </footer>
    </div>
  );
}
