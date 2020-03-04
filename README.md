# serverless-sqs-primer

A primer on how to submit and retrieve messages using AWS SQS λ

Amazon Simple Queue Service (SQS) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications

This primer is an extension to another primer called serverless-primer, for details read https://github.com/jbyrneie/serverless-primer/blob/master/README.md

https://serverless.com/blog/aws-lambda-sqs-serverless-integration/ is a good post about using SQS with AWS Lambda and Serverless

https://medium.com/@krishankantsinghal/working-with-aws-lambda-and-aws-sqs-using-serverless-framework-253102ffb179 is another post on how to send and receive messages using SQS

## Prerequisites

In order to access SQS queues locally, you need to setup and run ElasticMQ.

To download ElasticMQ go to https://github.com/softwaremill/elasticmq#elasticmq-via-docker

To start ElasticMQ, open a terminal window and run the following

```
$ cd serverless-sqs-primer
$ docker run -p 9324:9324 softwaremill/elasticmq
```

## Run Serverless Offline

```  
$ npm install
$ sls offline
```

## Test It

In a terminal window, run the following CURL command

```
curl -X POST http://localhost:<PORT>/v1/functions/serverless-primer-dev-submitMessageToQueue/invocations

where <PORT> is the port Serverless is running on
```

You shouuld see output similar to the following

```
$ curl -X POST http://localhost:3000/v1/functions/serverless-primer-dev-submitMessageToQueue/invocations
{"statusCode":200,"body":"{\n  \"message\": \"submitMessageToQueue handler executed successfully!\",\n  \"input\": {\n    \"isOffline\": true,\n    \"stageVariables\": {}\n  }\n}"}
```

## Updates to serverless.yml

serverless.yml needs to be updated to
- configure queues
- create queues on startup
- wire up Handler Events to invoke the handler when a message is posted to a queue


Configure serverless-offline-sqs to automatically create the queues on startup.

```
serverless-offline-sqs:
    autoCreate: true # create queue if not exists
    endpoint: http://localhost:9324
    region: us-east-1
    accessKeyId: root
    secretAccessKey: root
    skipCacheInvalidation: false
```

Configure the SQS Queues that are required

```
resources:
  Resources:
    SQSQueue:
      Type: "AWS::SQS::Queue"
      Properties:
        QueueName: SQSQueue
```

Add the serverless-offline-sqs plugin to the plugins section

```
plugins:
      - serverless-offline
      - serverless-offline-sqs
```

Finally, update any Handler events that are triggered when a message is submitted to an SQS queue

```
retrieveMessageFromQueue:
    handler: handler.retrieveMessageFromQueue
    events:
      - sqs:
          arn:
            Fn::GetAtt:
              - SQSQueue
              - Arn
```

