

import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenuButton from "./userMenu";
import { checkUser } from "@/lib/checkUser";
import { UserLoading } from "./user-loader";
import { usePathname } from "next/navigation";
import { headers } from "next/headers";

const Header = async () => {
  const user = await checkUser();
  
  return (
    <header>
      <nav className="flex justify-between px-7 py-4">
        <Link href="/">
          <h1 className="font-extrabold text-2xl uppercase tracking-tighter">
            Strive
          </h1>
        </Link>
        <div className="flex items-center gap-4">
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
      <UserLoading/>
    </header>
  );
};

export default Header;
