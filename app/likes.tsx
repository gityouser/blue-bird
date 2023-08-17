"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (tweet: TweetWithAuthor) => void;
}) {
  const router = useRouter();
  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (tweet.isLiked) {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          isLiked: !tweet.isLiked,
        });
        await supabase.from("likes").delete().match({
          user_id: user.id,
          tweet_id: tweet.id,
        });
      } else {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          isLiked: !tweet.isLiked,
        });
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      router.refresh();
    }
  };

  return (
    <button onClick={handleLikes}>
      {tweet.likes}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${
          tweet.isLiked
            ? "fill-red-600 stroke-red-600"
            : "fill-none stroke-gray-500"
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>{" "}
      Likes
    </button>
  );
}
