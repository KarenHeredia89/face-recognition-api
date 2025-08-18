import { Knex } from "knex";
import { incrementUserEntries } from "../repositories/image.repository";
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc"); // ClarifaiStub won't work with import

export const callClarifaiApi = async (imageUrl: string) => {
  const PAT = process.env.API_CLARIFAI;
  const USER_ID = "9mnqi2v7jz4x";
  const APP_ID = "my-first-application";
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

  const stub = ClarifaiStub.grpc();
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  return new Promise((resolve, reject) => {
    stub.PostModelOutputs(
      {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID,
        inputs: [
          {
            data: {
              image: {
                url: imageUrl,
                allow_duplicate_url: true,
              },
            },
          },
        ],
      },
      metadata,
      (err: any, response: any) => {
        if (err) {
          reject(new Error(err));
        }

        if (response.status.code !== 10000) {
          reject(
            new Error(
              "Post model outputs failed, status: " +
                response.status.description
            )
          );
        }

        const output = response.outputs[0];
        resolve(output);
      }
    );
  });
};

export const incrementEntries = async (
  db: Knex,
  id: number
): Promise<number | null> => {
  try {
    const entries = await incrementUserEntries(db, id);

    if (entries.length) {
      return entries[0].entries;
    }
    return null;
  } catch (error) {
    console.error("Error incrementing entries:", error);
    return null;
  }
};
