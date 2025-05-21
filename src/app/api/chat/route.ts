import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const normalizedMessages = message.map((msg: any) => ({
    role: msg.role === "bot" ? "assistant" : msg.role,
    content: msg.content || msg.text,
  }));

  const formattedText =
    normalizedMessages
      .map(
        (msg: any) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n") + "\nAssistant:";

  const input = {
    modelId: "amazon.titan-text-express-v1",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: formattedText,
    }),
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);

  const uint8Array = response.body;
  const jsonString = Buffer.from(uint8Array).toString("utf-8");

  const parsed = JSON.parse(jsonString);
  const outputText = parsed.results?.[0]?.outputText || "No output text found";
  return NextResponse.json(outputText);
}
