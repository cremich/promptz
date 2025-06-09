export function request(ctx) {
  return {
    operation: "PutEvents",
    events: [
      {
        source: "prompthub.aws.akkodis.com",
        detailType: "RuleCopied",
        detail: { ...ctx.args },
      },
    ],
  };
}

export function response(ctx) {
  return ctx.args;
}
