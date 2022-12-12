import {
  findAta,
  invalidate,
  IssueParameters,
  issueToken,
} from "@cardinal/token-manager";
import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
  nftModule,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { deprecated } from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  sendAndConfirmRawTransaction,
  Transaction,
} from "@solana/web3.js";
import { BN, Wallet } from "@project-serum/anchor";
import {
  InvalidationType,
  TokenManagerKind,
} from "@cardinal/token-manager/dist/cjs/programs/tokenManager";
import { SignerWallet } from "@saberhq/solana-contrib";
import { Token } from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { wallet } from "./constants";

const connection = new Connection(clusterApiUrl("devnet"));

const MAC1 = "C4:4F:33:08:4D:BD";
const MAC2 = "3C:71:BF:4F:BE:6C";

/**
 * https://arweave.net/-J8fBX4Pd4x8HaBWnw9Uo2iBiRbMptzZ2fg3u8XrHzE?ext=png
 * https://arweave.net/wYGtbu_a0RTgGpDkHpYrroO0_SHO-HdD_JFUueo4ZE8?ext=png
 */

const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet))
  .use(bundlrStorage());

const createNft = async () => {
  const { nft } = await metaplex.nfts().create({
    uri: "https://arweave.net/nrOuuc1eljyB11PR_s15Hsm3zOe9JUeY_qyQ0OL0kp0",
    name: "ESP 32 DEVICE #1",
    sellerFeeBasisPoints: 0,
    updateAuthority: wallet,
    mintAuthority: wallet,
    tokenOwner: wallet.publicKey,
    symbol: "ESP",
    isMutable: false,
    maxSupply: null,
  });

  console.log(nft);
};

const mintEdition = async (mint: PublicKey) => {
  const { nft: printedNft } = await metaplex.nfts().printNewEdition({
    originalMint: mint,
  });

  console.log(printedNft);

  return printedNft;
};

const createTokenManager = async (mint: PublicKey) => {
  // associated token account
  const account = await findAta(mint, wallet.publicKey);

  // issue parameters for the token manager
  const issueTokenParameters: IssueParameters = {
    mint,
    issuerTokenAccountId: account,
    amount: new BN(1),
    visibility: "private",
    kind: TokenManagerKind.Edition,
    invalidationType: InvalidationType.Return,
    customInvalidators: [wallet.publicKey],
  };

  // issue the token
  const [transaction, tokenManagerId, otpKeypair] = await issueToken(
    connection,
    new SignerWallet(wallet),
    issueTokenParameters
  );
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash("max")
  ).blockhash;
  transaction.sign(wallet);
  try {
    console.log("YOUR WALLET: ", wallet.publicKey.toString());
    console.log("NFT MINT: ", mint.toString());
    console.log("ASSOCIATED TOKEN ACCOUNT: ", account.toString());
    console.log("TOKEN MANAGER ID:", tokenManagerId.toString());
    console.log("OTP KEYPAIR:", otpKeypair?.publicKey.toString);
    await sendAndConfirmRawTransaction(connection, transaction.serialize(), {
      commitment: "confirmed",
    });
    const cluster = "devnet";
    const baseUrl = "https://rent.cardinal.so";
    const collection = "claim";
    const url = new URL(
      `${baseUrl}/${collection}/${tokenManagerId.toString()}`
    );
    url.searchParams.append("otp", bs58.encode(otpKeypair!.secretKey));
    url.searchParams.append("cluster", "devnet");
    console.log(url.toString());
  } catch (exception) {
    console.log("unable to mint managed edition", exception);
  }
};

const invalidateAndReturnNft = async (mint: PublicKey) => {
  try {
    const transaction = await invalidate(
      connection,
      new SignerWallet(wallet),
      mint
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash("max")
    ).blockhash;
    transaction.sign(wallet);
    await sendAndConfirmRawTransaction(connection, transaction.serialize(), {
      skipPreflight: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const transferNft = async (mint: PublicKey, tokenManager: PublicKey) => {
  try {
    const newAta = await findAta(
      mint,
      new PublicKey("Ss7aGjpwHm3Gg4MVNdXrm5C4GXuMvryCZUayjhPkouc")
    );
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        tokenManager,
        new PublicKey("Ss7aGjpwHm3Gg4MVNdXrm5C4GXuMvryCZUayjhPkouc"),
        tokenManager,
        [wallet],
        1
      )
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash("max")
    ).blockhash;
    transaction.sign(wallet);
    await sendAndConfirmRawTransaction(connection, transaction.serialize(), {
      skipPreflight: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  mintEdition,
  createTokenManager,
  createNft,
  invalidateAndReturnNft,
  connection,
  MAC1,
  MAC2,
  transferNft,
};
/**
 * "2iUHqoe5yc2M5LmVZf3eTKmeTBD72eR8m1EbJbKVT77B"
 */
