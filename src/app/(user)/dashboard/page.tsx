import React from "react";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable, { Quiz } from "./quizzesTable";
import getUserMetrics from "@/app/actions/getUserMetrics";
import MetricCard from "./metricCard";
import getHeatMapData from "@/app/actions/getHeatMapData";
import HeatMapDisplay from "./heatMap";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <p className="capitalize border-1 border-red-700 p-2">User not found</p>
    );
  }
  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();

  const userQuizzes: Quiz[] = await db.query.quizzes.findMany({
    where: eq(quizzes.userId, userId),
  });

  return (
    <div className="mt-4 mx-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:max-w-3xl">
        {userData && userData?.length > 0 ? (
          <>
            {userData?.map((data) => (
              <MetricCard
                label={data.label}
                value={data.value}
                key={data.label}
              />
            ))}
          </>
        ) : null}
      </div>
      <div>
        {heatMapData ? <HeatMapDisplay data={heatMapData.data} /> : null}
      </div>
      <QuizzesTable quizzes={userQuizzes} />
    </div>
  );
};

export default page;
