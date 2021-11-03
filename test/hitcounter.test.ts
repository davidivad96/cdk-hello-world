import { Template, Capture } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';
import { HitCounter } from '../lib/hitcounter';

test('DynamoDB Table Created', () => {
  const stack = new cdk.Stack();

  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream: new NodejsFunction(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '/../lambda/hello.ts'),
    }),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::DynamoDB::Table', 1);
});

test('Lambda Has Environment Variables', () => {
  const stack = new cdk.Stack();

  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream: new NodejsFunction(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '/../lambda/hello.ts'),
    }),
  });

  // THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: envCapture,
  });
  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: 'TestFunction22AD90FC',
      },
      HITS_TABLE_NAME: {
        Ref: 'MyTestConstructHits24A357F0',
      },
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  });
});

test('DynamoDB Table Created With Encryption', () => {
  const stack = new cdk.Stack();

  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream: new NodejsFunction(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '/../lambda/hello.ts'),
    }),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    SSESpecification: {
      SSEEnabled: true,
    },
  });
});

test('Read Capacity Can Be Configured', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new HitCounter(stack, 'MyTestConstruct', {
      downstream: new NodejsFunction(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'handler',
        entry: path.join(__dirname, '/../lambda/hello.ts'),
      }),
      readCapacity: 3,
    });
  }).toThrowError('readCapacity must be greater than 5 and less than 20');
});
