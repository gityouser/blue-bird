import { Inter } from "@next/font/google";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth/callback/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");

  if (!session) {
    redirect("login");
  }

  return (
    <>
      <NewTweet />
      <AuthButtonServer />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
