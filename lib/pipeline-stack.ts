import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodeBuildStep, CodePipelineSource } from '@aws-cdk/pipelines';
import { WorkshopPipelineStage } from './pipeline-stage';

export class WorkshopPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The basic pipeline declaration. This sets the initial structure of our pipeline
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'WorkshopPipeline',
      synth: new CodeBuildStep('SynthStep', {
        input: CodePipelineSource.connection('davidivad96/cdk-hello-world', 'main', {
          connectionArn:
            'arn:aws:codestar-connections:eu-west-1:682507345650:connection/9c9b7e95-a89e-46a3-ab83-e3c8a1411957',
        }),
        installCommands: ['npm install -g aws-cdk'],
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    const deploy = new WorkshopPipelineStage(this, 'Deploy');
    const deployStage = pipeline.addStage(deploy);

    deployStage.addPost(
      new CodeBuildStep('TestViewerEndpoint', {
        projectName: 'TestViewerEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcViewerUrl,
        },
        commands: ['curl -Ssf $ENDPOINT_URL'],
      }),

      new CodeBuildStep('TestAPIGatewayEndpoint', {
        projectName: 'TestAPIGatewayEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcEndpoint,
        },
        commands: [
          'curl -Ssf $ENDPOINT_URL',
          'curl -Ssf $ENDPOINT_URL/hello',
          'curl -Ssf $ENDPOINT_URL/test',
        ],
      }),
    );
  }
}
