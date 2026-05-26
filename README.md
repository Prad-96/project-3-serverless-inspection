# Serverless Inspection Platform

A fully serverless, event-driven inspection platform built on AWS.

## Services Used

- Route 53
- CloudFront
- S3
- API Gateway
- AWS Lambda
- DynamoDB
- SNS
- SQS
- VPC Endpoints

## Application Features

- React frontend hosted on S3
- Create inspection records
- Store metadata in DynamoDB
- Upload inspection images to S3 using presigned URLs
- Trigger asynchronous processing using SNS and SQS
- Worker Lambda updates inspection status to COMPLETED

## API Gateway Base URL

https://ue8ms8o4na.execute-api.us-east-1.amazonaws.com/prod

## API Routes

POST /inspections  
GET /inspections  
POST /upload-url  
POST /process-inspection  

## DynamoDB Table

Table name: inspections

Partition key: inspectionId

Attributes:
- inspectionId
- title
- description
- status
- createdAt
- updatedAt

## Workflow

1. User opens the React frontend.
2. User creates a new inspection.
3. API Gateway invokes Lambda.
4. Lambda stores inspection metadata in DynamoDB.
5. User uploads image directly to S3 using a presigned URL.
6. User clicks Process Inspection.
7. Lambda publishes a message to SNS.
8. SNS sends the message to SQS.
9. SQS triggers worker Lambda.
10. Worker Lambda updates DynamoDB status to COMPLETED.
