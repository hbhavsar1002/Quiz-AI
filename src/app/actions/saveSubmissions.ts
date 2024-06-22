"use server";

import { db } from "@/db";
import { quizSubmissions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";

type Submissision = InferInsertModel<typeof quizSubmissions>;

export async function saveSubmission(sub: Submissision, quizId: number) {
  const { score } = sub;
  const session = await auth();
  const userId = session?.user?.id;

  const newSubmission = await db
    .insert(quizSubmissions)
    .values({
      score,
      quizId,
    })
    .returning({ insertedId: quizSubmissions.id });

  const submissionId = newSubmission[0].insertedId;
  return submissionId;
}
