import { S3 } from 'aws-sdk'
import { v4 } from 'uuid'

const s3Client = new S3()

async function handler(event: any, context: any) {
    const buckets = await s3Client.listBuckets().promise();
    console.log('Got an event:');
    console.log(event);
    
    console.log(event);
    return {
        statusCode: 200,
        //body: 'Hello from lambda! ' + v4()
        body: 'Hello from lambda! ' + JSON.stringify(buckets.Buckets)
    }
}

export { handler }