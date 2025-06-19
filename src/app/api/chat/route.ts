import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const normalizedMessages = message.map((msg: any) => ({
      role: msg.role === "bot" ? "assistant" : msg.role,
      content: msg.content || msg.text,
    }));

    const formattedText =
      normalizedMessages
        .map(
          (msg: any) =>
            `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
        )
        .join("\n\n") + "\n\nAssistant:";

    const input = {
      modelId: "anthropic.claude-v2:1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: formattedText,
        max_tokens_to_sample: 300,
        temperature: 0.5,
        top_k: 250,
        top_p: 0.9,
        stop_sequences: ["\n\nHuman:"],
      }),
    };

    try {
      const client = new BedrockRuntimeClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
      const command = new InvokeModelCommand(input);
      const response = await client.send(command);
      const responseBody = await response.body.transformToString();

      return NextResponse.json({
        statusCode: 200,
        body: responseBody,
      });
    } catch (err: any) {
      return NextResponse.json({
        statusCode: 500,
        error: JSON.stringify({ error: err.message }),
      });
    }
  } catch (error) {
    // console.log("An error came", error);
    return NextResponse.json({ error: error });
  }
}
