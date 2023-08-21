import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Tweets from "./tweets";

/*
  'force-dynamic': Force dynamic rendering and uncached data fetching of a layout or page by disabling all caching of fetch requests and always revalidating. This option is equivalent to:
    getServerSideProps() in the pages directory.
    Setting the option of every fetch() request in a layout or page to { cache: 'no-store', next: { revalidate: 0 } }.
    Setting the segment config to export const fetchCache = 'force-no-store'
 */
export const dynamic = "force-dynamic";

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
    .select("*, author: profiles(*), likes(*)")
    .order("created_at", {
      ascending: false,
    });
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
