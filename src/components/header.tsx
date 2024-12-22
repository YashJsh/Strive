import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenuButton from "./userMenu";

const Header = () => {
  return (
    <header>
      <nav className="flex justify-between px-7 py-4">
        <Link href="/">
          <h1 className="font-extrabold text-2xl uppercase tracking-tighter">
            Strive
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Button className="text-base font-semibold">
            <Link href="/create/project">Create Project</Link>
          </Button>
          <SignedOut>
            <Button variant={"destructive"} className="text-base  font-semibold">
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserMenuButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
