"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizSubmission from "./QuizSubmission";
import Link from "next/link";

interface Answer {
  answerText: string;
  isCorrect: boolean;
  id: number;
}

interface Question {
  questionText: string;
  answers: Answer[];
}

const questions: Question[] = [
  {
    questionText: "What is React?",
    answers: [
      {
        answerText: "A library for building user interfaces",
        isCorrect: true,
        id: 1,
      },
      { answerText: "A front-end framework", isCorrect: false, id: 2 },
      { answerText: "A back-end framework", isCorrect: false, id: 3 },
      { answerText: "A database", isCorrect: false, id: 4 },
    ],
  },
  {
    questionText: "What is JSX?",
    answers: [
      { answerText: "JavaScript XML", isCorrect: true, id: 1 },
      { answerText: "JavaScript", isCorrect: false, id: 2 },
      { answerText: "JavaScript and XML", isCorrect: false, id: 3 },
      { answerText: "JavaScript and HTML", isCorrect: false, id: 4 },
    ],
  },
  {
    questionText: "What is Virtual DOM?",
    answers: [
      {
        answerText: "A virtual representation of the DOM",
        isCorrect: true,
        id: 1,
      },
      { answerText: "A real DOM", isCorrect: false, id: 2 },
      {
        answerText: "A virtual representation of the browser",
        isCorrect: false,
        id: 3,
      },
      {
        answerText: "A virtual representation of the server",
        isCorrect: false,
        id: 4,
      },
    ],
  },
];

export default function Home() {
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  //const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  //const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submiited, setSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: number; answerId: number }[]
  >([]);

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

    //setSelectedAnswer(null);
    //setIsCorrect(null);
  };

  const handleAnser = (answer: Answer) => {
    const newUserAnswersArr: typeof userAnswers = [
      ...userAnswers,
      {
        questionId: currentQuestion,
        answerId: answer.id,
      },
    ];
    setUserAnswers(newUserAnswersArr);
    //setSelectedAnswer(answer.id);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
    //setIsCorrect(isCurrentCorrect);
  };

  const handlePressPrev = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion - 1);
    }
  };

  const handleExit = () => {
    window.location.href = "/quiz";
  };

  const scorePercentage: number = Math.round((score / questions.length) * 100);

  const selectedAnswer: number | null | undefined = userAnswers.find(
    (item) => item.questionId === currentQuestion
  )?.answerId;

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
    <>
      {!started && (
        <Link
          href={"/quiz/new"}
          className="w-fit"
        >
          <Button
            type="submit"
            variant="ghost"
          >
            New Quiz
          </Button>
        </Link>
      )}

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
              {" "}
              Welcom to Sample Quiz
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
                        variant={variant}
                        size={"sm"}
                        onClick={() => handleAnser(answer)}
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
              )?.answerText
            }
          />
          <Button
            onClick={handleNext}
            size="lg"
            variant="neo"
            className="font-bold"
          >
            {!started
              ? "Start"
              : currentQuestion === questions.length - 1
              ? "Submit"
              : "Next"}
          </Button>
        </footer>
      </div>
    </>
  );
}
