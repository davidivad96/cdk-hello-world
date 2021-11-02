import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';

export class CdkHelloWorldStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const hello = new NodejsFunction(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '/../lambda/hello.ts'),
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
  }
}
