import { quizzes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

export type Quiz = InferSelectModel<typeof quizzes>;

type Props = {
  quizzes: Quiz[];
};

const QuizzesTable = (props: Props) => {
  const quizzes = props;
  return (
    <div className="rounded-md overflow-hidden p-5 border">
      <h2 className="text-xl font-bold mb-4">Quiz List</h2>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="text-[#6c7381] text-left px-5">Name</th>
            <th className="text-[#6c7381] text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.quizzes.map((quiz: Quiz) => (
            <tr key={quiz.id}>
              <td>
                <Link href={`/quiz/${quiz.id}`}>
                  <p className="text-blue-600 px-5 capitalize">{quiz.name}</p>
                </Link>
              </td>
              <td>{quiz.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizzesTable;
