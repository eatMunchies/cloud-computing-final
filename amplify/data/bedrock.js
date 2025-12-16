export function request(ctx) {
  const { ingredients = [] } = ctx.args;
  
  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;
  
  return {
    resourcePath: `/model/us.anthropic.claude-3-5-sonnet-20240620-v1:0/invoke`,  // Added "us." prefix
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    },
  };
}

export function response(ctx) {
  if (!ctx.result || !ctx.result.body) {
    return {
      body: `Debug: No result body. Full context: ${JSON.stringify(ctx)}`,
      error: "No result body",
    };
  }
  
  const parsedBody = JSON.parse(ctx.result.body);
  
  if (!parsedBody.content || !Array.isArray(parsedBody.content) || parsedBody.content.length === 0) {
    return {
      body: `Debug: Unexpected structure. Response: ${JSON.stringify(parsedBody)}`,
      error: "Unexpected response structure",
    };
  }
  
  return {
    body: parsedBody.content[0].text,
    error: null,
  };
}