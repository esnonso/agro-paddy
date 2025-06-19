import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  const prompt = `You are AgroPaddy, an intelligent farming assistant for African farmers. Speak simply, avoid technical jargon, and support Hausa, Yoruba, and Igbo where possible.

    \n\nHuman: Hello
    \n\nAssistant:`;

  const input = {
    modelId: "anthropic.claude-v2",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt,
      max_tokens_to_sample: 300,
      temperature: 0.7,
    }),
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const body = await response.body.transformToString();

    return NextResponse.json({ message: body });
  } catch (err: any) {
    // console.error("Claude error:", err);
    return NextResponse.json({ error: err.message });
  }
}
