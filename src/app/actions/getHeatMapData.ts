//we have used the library HeatMap for React
import { quizzes, questions, quizSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { avg, count, eq, sql } from "drizzle-orm";

const getHeatMapData = async() => {
    const session = await auth();
    const userId = session?.user?.id;
  
    if (!userId) {
      return;
    }

    const data =  await db.select({
        createdAt: quizSubmissions.createdAt,
        count: sql<number>`cast(count(${quizSubmissions.id}) as int)`
    }).from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId))
    .groupBy(quizSubmissions.createdAt)

    return {data}
}

export default getHeatMapData