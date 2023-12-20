import type { NextPage } from "next";
import Head from "next/head";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../lib/authContext";
import Link from "next/link";
import Openfort, { OpenfortAuth } from "@openfort/openfort-js";

const openfort = new Openfort(process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!);

const openfortAuth = new OpenfortAuth(
  process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!
);

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user)
    return (
      <div className="flex space-x-2">
        <h1>{"You already logged. Head to "}</h1>
        <Link href="/private" className="underline text-blue-600">
          /Private
        </Link>
      </div>
    );

  const auth = getAuth();

  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const idToken = await userCredential.user.getIdToken();
        await openfortAuth.authorizeWithOAuthToken("firebase", idToken);
        console.log("success", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
      });
  }

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.

        const idToken = await result.user.getIdToken();
        await openfortAuth.authorizeWithOAuthToken("firebase", idToken);
        // The signed-in user info.
        const user = result.user;
        console.log("sign with google", user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  return (
    <>
      <Head>
        <title>Signin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-auto my-24 w-1/3 h-1/3 divide-y-4 space-y-1">
        <div className="space-y-1">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-current	"
          />
          <br />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-current	"
          />
          <br />
          <button onClick={() => login()}>Login</button>
        </div>
        <div>
          <button onClick={() => loginWithGoogle()}>Login with Google</button>
        </div>
      </div>
    </>
  );
};

export default Home;
