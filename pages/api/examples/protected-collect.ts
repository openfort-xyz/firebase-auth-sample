// This is an example of to protect an API route

import type { NextApiRequest, NextApiResponse } from "next";
import Openfort from "@openfort/openfort-node";
import adminInit from "../../../lib/firebaseConfig/init-admin";
import nookies from "nookies";

const openfort = new Openfort(process.env.NEXTAUTH_OPENFORT_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idToken } = nookies.get({ req });
  var fbInfo = await adminInit.auth().verifyIdToken(idToken);
  const authResult  =await openfort.iam.verifyOAuthToken({provider:"firebase", token: idToken, tokenType: "idToken"})

  if (fbInfo && authResult) {
      const playerId = authResult.id;

      const policy_id = "pol_97b96564-4fcb-41f4-a26f-bd9dcf4610be";
      const contract_id = "con_3ba09ba7-d260-4cd7-8600-92aef0706544";
      const chainId = 80001;
      const optimistic = true;

      const interaction_mint = {
        contract: contract_id,
        functionName: "mint",
        functionArgs: [playerId],
      };

      try {
        const transactionIntent = await openfort.transactionIntents.create({
          player: playerId,
          policy: policy_id,
          chainId,
          optimistic,
          interactions: [interaction_mint],
        });

        return res.send({
          data: transactionIntent,
        });
      } catch (e: any) {
        console.log(e);
        return res.send({
          data: null,
        });
      }

  }

  res.send({
    error: "You must be signed in to view the protected content on this page.",
  });
}
