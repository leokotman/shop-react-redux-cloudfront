import {
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_s3,
  aws_s3_deployment,
  CfnOutput,
  RemovalPolicy,
} from "aws-cdk-lib";
import * as fs from "node:fs";
import * as path from "node:path";
import { Construct } from "constructs";

/** Vite build output (run `npm run build` at repo root). Required for synth/deploy/destroy. */
const webAppBuildDir = path.join(__dirname, "..", "..", "dist");

export class DeploymentService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    if (!fs.existsSync(webAppBuildDir)) {
      throw new Error(
        `Frontend static assets not found at ${webAppBuildDir}. ` +
          "Run `npm run build` from the repository root (parent of `infra/`) first. " +
          "CDK runs your app for `cdk destroy` too, so the asset path must exist.",
      );
    }

    const hostingBucket = new aws_s3.Bucket(this, "FrontendBucket", {
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new aws_cloudfront.Distribution(
      this,
      "CloudfrontDistribution",
      {
        defaultBehavior: {
          origin:
            aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
              hostingBucket,
            ),
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      },
    );

    new aws_s3_deployment.BucketDeployment(this, "BucketDeployment", {
      sources: [aws_s3_deployment.Source.asset(webAppBuildDir)],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    new CfnOutput(this, "CloudFrontURL", {
      value: distribution.domainName,
      description: "The distribution URL",
      exportName: "CloudfrontURL",
    });

    new CfnOutput(this, "BucketName", {
      value: hostingBucket.bucketName,
      description: "The name of the S3 bucket",
      exportName: "BucketName",
    });
  }
}
