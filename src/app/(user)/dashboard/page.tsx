import React from "react";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable, { Quiz } from "./quizzesTable";
import getUserMetrics from "@/app/actions/getUserMetrics";
import MetricCard from "./metricCard";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found</p>;
  }
  const userData = await getUserMetrics();
  console.log(userData);

  const userQuizzes: Quiz[] = await db.query.quizzes.findMany({
    where: eq(quizzes.userId, userId),
  });

  return (
    <>
      {userData && userData?.length > 0 ? (
        <>
          {userData?.map((data) => (
            <MetricCard
              label={data.label}
              value={data.value}
            />
          ))}
        </>
      ) : null}
      <QuizzesTable quizzes={userQuizzes} />
    </>
  );
};

export default page;
