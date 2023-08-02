"use client";

export function AuthButton() {
  const handleSignIn = async () => {
    console.log("clicked :>> ");
  };
  return <button onClick={handleSignIn}>Login</button>;
}

export default AuthButton;
