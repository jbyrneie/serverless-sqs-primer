'use strict';

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
  accessKeyId: 'none',
  secretAccessKey: 'none',
  region: 'us-east-1',
});

// Create an SQS service object
const sqs = new AWS.SQS();

module.exports.submitMessageToQueue = async event => {
  console.log('submitMessageToQueue handler called....')
  
  // SQS message parameters
  const params = {
    MessageBody: 'This is the message',
    QueueUrl: 'http://localhost:9324/queue/SQSQueue'
  };

  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `submitMessageToQueue handler executed successfully!,
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.retrieveMessageFromQueue = async event => {
  console.log(`retrieveMessageFromQueue handler called...... ${event.Records.length} message received`)
  const body = event.Records[0].body
  console.log(`Message: ${JSON.stringify(body)}`)

  return {
    statusCode: 200,
  };
};
