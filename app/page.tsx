import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: tweets } = await supabase.from("tweets").select();

  return <pre>{JSON.stringify(tweets, null, 2)}</pre>;
}
