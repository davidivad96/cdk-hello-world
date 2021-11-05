import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as apigw from '@aws-cdk/aws-apigateway';
import { TableViewer } from 'cdk-dynamo-table-viewer';
import * as path from 'path';
import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends cdk.Stack {
  public readonly hcViewerUrl: cdk.CfnOutput;
  public readonly hcEndpoint: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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

    // defines another AWS Lambda resource
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    });

    // defines an API Gateway REST API resource backed by our "hello" function
    const gateway = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });

    // defines a custom construct named Table Viewer (https://www.npmjs.com/package/cdk-dynamo-table-viewer)
    const tv = new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits',
    });

    // add outputs to see the endpoints
    this.hcEndpoint = new cdk.CfnOutput(this, 'GatewayUrl', {
      value: gateway.url,
    });

    this.hcViewerUrl = new cdk.CfnOutput(this, 'TableViewUrl', {
      value: tv.endpoint,
    });
  }
}
