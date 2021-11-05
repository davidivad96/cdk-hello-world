import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodeBuildStep, CodePipelineSource } from '@aws-cdk/pipelines';

export class WorkshopPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The basic pipeline declaration. This sets the initial structure of our pipeline
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'WorkshopPipeline',
      synth: new CodeBuildStep('SynthStep', {
        input: CodePipelineSource.connection('davidivad96/cdk-hello-world', 'main', {
          connectionArn:
            'arn:aws:codestar-connections:eu-west-1:682507345650:connection/b0471c66-69b3-4dbb-87da-4a74a296bd93',
        }),
        installCommands: ['npm install -g aws-cdk'],
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });
  }
}
