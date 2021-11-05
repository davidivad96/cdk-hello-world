import { CdkWorkshopStack } from './cdk-workshop-stack';
import { Stage, Construct, StageProps } from '@aws-cdk/core';

export class WorkshopPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new CdkWorkshopStack(this, 'WebService');
  }
}
