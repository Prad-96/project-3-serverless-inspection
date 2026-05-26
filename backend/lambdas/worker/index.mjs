import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  for (const record of event.Records) {
    const snsBody = JSON.parse(record.body);
    const message = JSON.parse(snsBody.Message);

    const inspectionId = message.inspectionId;

    if (!inspectionId) {
      console.log("No inspectionId found, skipping");
      continue;
    }

    await ddb.send(new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { inspectionId },
      UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": "COMPLETED",
        ":updatedAt": new Date().toISOString()
      }
    }));

    console.log(`Inspection ${inspectionId} marked COMPLETED`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Processed SQS messages" })
  };
};
