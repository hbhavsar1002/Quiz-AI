import { quizzes, questions, quizSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { avg, count, eq } from "drizzle-orm";

const getUserMetrics = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  // get total number of user quizzes
  const numQuizzes = await db
    .select({
      value: count(),
    })
    .from(quizzes)
    .where(eq(quizzes.userId, userId));

  const numQuestions = await db
    .select({ value: count() })
    .from(questions)
    .innerJoin(quizzes, eq(quizzes.id, questions.quizId))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  //get total submissions
  const numSubmissions = await db
    .select({ value: count() })
    .from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

    //get averagw of the score

    const avgScore = await db
    .select({value: avg(quizSubmissions.score)})
    .from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  return [
    {label: "Number of Quizzes", value: numQuizzes[0].value},
    {label: "Number of Questions", value: numQuestions[0].value},
    {label: "Number of Submissions", value: numSubmissions[0].value},
    {label: "Average Score", value: avgScore[0].value }
]
  ;
};

export default getUserMetrics;
