import { db } from "@/db"; // to run queries and mutations on the database
import {
  quizzes,
  questions as dbQuestions,
  answers as dbAnswers,
  answers,
} from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

type Quiz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof dbAnswers>;

interface SaveQuizData extends Quiz {
  questions: Array<Question & { answers?: Answer[] }>;
}

export default async function saveQuiz(quizData: SaveQuizData) {
  const { name, description, questions } = quizData;

  const newQuiz = await db
    .insert(quizzes)
    .values({
      name,
      description,
    })
    .returning({
      insertedId: quizzes.id,
    });

  await db.transaction(async (tx) => {
    for (const question of questions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values({
          questionText: question.questionText,
          quizId,
        })
        .returning({ questionId: dbQuestions.id });

      if (question.answers && question.answers.length > 0) {
        await tx.insert(answers).values(
          question.answers.map((answer) => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
            questionId,
          }))
        );
      }
    }
  });

  const quizId = newQuiz[0].insertedId;

  return { quizId };
}
