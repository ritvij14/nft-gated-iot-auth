import {
  invalidate,
  IssueParameters,
  issueToken,
} from "@cardinal/token-manager";
import {
  InvalidationType,
  TokenManagerKind,
} from "@cardinal/token-manager/dist/cjs/programs/tokenManager";
import { BN, Wallet } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { mintEdition, createNft, connection, wallet, MAC } from "./mintEdition";

const createTokenManager = async () => {
  // payment amount 10 for duration of 86400 seconds (24 hours)
  const issueTokenParameters: IssueParameters = {
    mint: new PublicKey("HsccEUDaRWbbJprqrovE6V9my3NUjZ7ciMvsZB2rGKzN"),
    issuerTokenAccountId: new PublicKey(
      "4uca71qiJ9eB1LBgXYRUmRTzd9aYzJonBFE8c57rTpdB"
    ),
    amount: new BN(1),
    visibility: "private",
    kind: TokenManagerKind.Edition,
    invalidationType: InvalidationType.Return,
  };

  try {
    const [transaction] = await issueToken(
      connection,
      new Wallet(wallet),
      issueTokenParameters
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash("max")
    ).blockhash;
    // transaction.sign(wallet, masterEditionMint);
    // await sendAndConfirmRawTransaction(connection, transaction.serialize(), {
    //   commitment: "confirmed",
    // });
  } catch (exception) {
    // handle exception
  }
};
