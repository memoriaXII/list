import "dotenv/config";
import * as fs from "fs";
import path from "path";
import { ChainId } from "@sushiswap/chain";
import * as cloudinary from "cloudinary";

const BASE_DIR = "https://cdn.sushi.com/image/upload";

const NETWORK_TO_CHAIN_ID: Record<
  string,
  | ChainId
  | 8453
  | 1116
  | 11235
  | 59144
  | 324
  | 534352
  | 314
  | 7000
  | 81457
  | 2046399126
  | 30
  | 25
  | 11155111
  | 421614
  | 98866
  | 98867
> = {
  // sepolia: 11155111,
  // arbitrum: ChainId.ARBITRUM,
  "plume-mainnet": 98866,
};

syncCDN();

async function syncCDN() {
  const dir = path.join(__dirname, "../network/");
  const networks = await fs.promises.readdir(dir);

  for (const network of networks) {
    if (network in NETWORK_TO_CHAIN_ID) {
      const networkPath = path.join(dir, network);
      const logos = await fs.promises.readdir(networkPath);
      await syncLogosForNetwork(
        NETWORK_TO_CHAIN_ID[network],
        networkPath,
        logos
      );
    } else {
      console.log("Unknown network", network);
    }
  }
}

async function syncLogosForNetwork(
  chainId: number,
  dir: string,
  files: string[]
) {
  console.log("Syncing chainId", chainId);
  for (const file of files) {
    // let cdnFileResponse: Response;
    // try {
    //   cdnFileResponse = await fetch(`${BASE_DIR}/tokens/${chainId}/${file}`);
    // } catch (e) {
    //   console.log(
    //     "Error fetching logo",
    //     `${BASE_DIR}/tokens/${chainId}/${file}`,
    //     e
    //   );
    //   return;
    // }


      try {
        const uploadedFile = await cloudinary.v2.uploader.upload(
          path.join(dir, file),
          {
            folder: `tokens/${chainId}`,
            use_filename: true,
            unique_filename: false,
          }
        );
        console.log("Uploaded logo", uploadedFile);
      } catch (e) {
        console.log("Error uploading file", chainId, file, e);
      }
    
  }
}
