// pages/api/predict.ts
import { NextResponse, NextRequest } from "next/server";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

const sagemakerRuntime = new SageMakerRuntimeClient({
  region: "us-east-1", // your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") throw new Error("Method not allowed");
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());

    const command = new InvokeEndpointCommand({
      EndpointName: "disease-detector", // Change to your deployed SageMaker endpoint
      Body: imageBuffer,
      ContentType: "application/x-image",
      Accept: "application/json",
    });

    const response = await sagemakerRuntime.send(command);
    const prediction = JSON.parse(Buffer.from(response.Body).toString());
    return NextResponse.json({ prediction });
  } catch (error) {
    //console.log(error);
    return NextResponse.json({ error: "An error occured" });
  }
}
