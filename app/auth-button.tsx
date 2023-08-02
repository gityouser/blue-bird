"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function AuthButton() {
  const supabase = createClientComponentClient();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <button onClick={handleSignOut}>Logout</button>
      <button onClick={handleSignIn}>Login</button>
    </>
  );
}

export default AuthButton;
