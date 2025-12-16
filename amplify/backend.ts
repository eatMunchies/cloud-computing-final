import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-2.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-2",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      // Allow access to inference profiles in us-east-2
      "arn:aws:bedrock:us-east-2:*:inference-profile/*",
      // Allow access to the underlying foundation models in us-west-2
      "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0",
      // Be permissive for other regions too
      "arn:aws:bedrock:*::foundation-model/anthropic.claude-*",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);