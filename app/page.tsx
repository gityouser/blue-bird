import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth/callback/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Tweets from "./tweets";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)");
  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      likes: tweet.likes.length,
      isLiked: !!tweet.likes.find((like) => like.user_id === session.user.id),
    })) || [];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
        <h1 className="text-lx font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={session.user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
