export default function NewTweet() {
  const addTweet = async () => {
    "use server";
    console.log("submitted");
  };

  return (
    <form action={addTweet}>
      <input className="bh-inherit" name="title" />
    </form>
  );
}
