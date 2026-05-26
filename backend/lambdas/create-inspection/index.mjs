import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const inspectionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const item = {
      inspectionId,
      title: body.title || "Untitled Inspection",
      description: body.description || "",
      status: "PENDING",
      createdAt: now,
      updatedAt: now
    };

    await ddb.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item
    }));

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: error.message })
    };
  }
};
