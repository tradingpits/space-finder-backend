import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path'
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';


export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceAPI');
    private spacesTable = new GenericTable(
        'spacesTable',
        'spaceId',
        this
    )

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        });

        const helloLambdaWebpack = new LambdaFunction(this, 'helloLambdaWebpack', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, '..', 'build', 'nodeHelloLambda')),
            handler: 'nodeHelloLambda.handler'
        });

        const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
            entry: (join(__dirname, '..', 'services', 'node-lambda', 'hello.ts')),
            handler: 'handler'
        });

        // Hello API Lambda integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);
    }
}