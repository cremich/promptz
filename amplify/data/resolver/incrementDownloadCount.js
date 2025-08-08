import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({ id: ctx.args.id }),
    update: {
      expression: "ADD downloadCount :plusOne",
      expressionValues: { ":plusOne": { N: 1 } },
    },
  };
}

export function response(ctx) {
  const detailType =
    ctx.info.fieldName === "copyPrompt"
      ? "prompt.downloaded"
      : "projectrule.downloaded";

  ctx.stash.event = { detailType, detail: ctx.result };

  return ctx.result;
}
