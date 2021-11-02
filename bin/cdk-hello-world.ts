#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkHelloWorldStack } from '../lib/cdk-hello-world-stack';

const app = new cdk.App();
new CdkHelloWorldStack(app, 'CdkHelloWorldStack');
