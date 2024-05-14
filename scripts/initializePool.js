import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import idl from './idl.json' assert { type: 'json' };
// const idl = require('./idl.json');
 // Ensure you have the IDL JSON file of your program

// Setup the connection and wallet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('../target/deploy/whirlpool-keypair.json', 'utf-8'))));
// Initialize your wallet here

const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

const programId = new PublicKey("FUA9Uv5teZe9MoKE9m5bbovx217zDuoc6zvHm25d2iKT");
const program = new Program(idl, programId, provider);



// Example public keys, replace with actual keys
const whirlpoolsConfigPubKey = new PublicKey("WhirlpoolsConfig_PUBLIC_KEY");
const tokenMintAPubKey = new PublicKey("TOKEN_MINT_A_PUBLIC_KEY");
const tokenMintBPubKey = new PublicKey("TOKEN_MINT_B_PUBLIC_KEY");
const feeTierPubKey = new PublicKey("FeeTier_PUBLIC_KEY");

// You will need to create new accounts or identify existing ones for whirlpool and token vaults
const whirlpoolAccount = new web3.Account(); // This might need to be a derived account
const tokenVaultAAccount = new web3.Account();
const tokenVaultBAccount = new web3.Account();

// Prepare transaction signers
const signers = [wallet.payer, whirlpoolAccount, tokenVaultAAccount, tokenVaultBAccount]; // Include all necessary signers

// Prepare the instruction call
const tickSpacing = 10; // Example tick spacing
const initialSqrtPrice = 500000; // Example initial square root price

async function initializePool() {
    try {
      const tx = await program.rpc.initializePool(
        {
          whirlpoolsConfig: whirlpoolsConfigPubKey,
          tokenMintA: tokenMintAPubKey,
          tokenMintB: tokenMintBPubKey,
          funder: wallet.publicKey,
          whirlpool: whirlpoolAccount.publicKey,
          tokenVaultA: tokenVaultAAccount.publicKey,
          tokenVaultB: tokenVaultBAccount.publicKey,
          feeTier: feeTierPubKey,
          tokenProgram: TOKEN_PROGRAM_ID, // from @solana/spl-token
          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY
        },
        new anchor.BN(tickSpacing),
        new anchor.BN(initialSqrtPrice)
      );
      console.log("Pool initialized successfully with transaction ID:", tx);
    } catch (error) {
      console.error("Error initializing pool:", error);
    }
  }
  
  // Run the function
  initializePool();
  