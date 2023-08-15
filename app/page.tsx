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
    <div className="bg-blue-200 w-full max-w-xl mx-auto">
      <AuthButtonServer />
      <NewTweet />
      <Tweets tweets={tweets} />
    </div>
  );
}
