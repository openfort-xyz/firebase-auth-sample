import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useAuth } from "../lib/authContext";
import { CollectButton } from "../components/CollectButton";

const Home: NextPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;
  if (!user) return <h1>You need to login</h1>;

  return (
    <>
      <Head>
        {" "}
        <title>Private</title>
      </Head>

      <main>
        <h1 className="uppercase mb-5 underline font-bold">Private</h1>
        <p>Email : {user?.claims.email ?? "Anonymous"}</p>
        <br />
        <div className="space-y-2">
          <p className="text-sm">Mint an NFT</p>
          <CollectButton />
        </div>
      </main>
    </>
  );
};

export default Home;
