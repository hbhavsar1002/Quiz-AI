import Link from "next/link";
import { Button } from "./components/ui/button";

const Header = () => {
  return (
    <header>
      <nav className="px-4 py-2.5 flex gap-2">
        <Link href={"/quiz"}>
          <Button
            type="submit"
            variant="ghost"
            className="border"
          >
            Sample Quiz
          </Button>
        </Link>
        <Link href={"/quiz/new"}>
          <Button
            type="submit"
            variant="ghost"
            className="border"
          >
            New Quiz
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
