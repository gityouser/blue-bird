import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GithubButton from "./github-button";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex-1 flex justify-center items-center flex-col">
      <Image
        src="/images/twitter-cat-logo.png"
        alt="logo"
        width={48}
        height={48}
        className="-mb-12 -ml-16 -rotate-12 pointer-events-none"
      />
      <GithubButton />
      <p className="text-sm text-gray-400 font-medium">Login to post a tweet</p>
    </div>
  );
}
