const { z } = require("zod");

// See more: https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md#Customizing-errors-with-ZodErrorMap

const customErrorMap = (issue, ctx) => {
  const property = issue.path.join('.');

  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (['null', 'undefined'].includes(issue.received)) {
      return { message: `${property}.required` }
    }
    return { message: `${property}.not${(issue.expected.charAt(0).toUpperCase() + issue.expected.slice(1))}` };
  }

  if (issue.code === z.ZodIssueCode.too_small) {
    return { message: `${property}.invalid.min.${issue.inclusive ? issue.minimum : issue.minimum + 1}` }
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap)

const schema = z.object({
  code: z.number(),
  description: z.object({
    name: z.string(),
    details: z.string(),
  }),
  price: z.number().nonnegative()
});

const validation = schema.safeParse({
  code: 'joão',
  description: { name: 12 },
  price: -12
})

// console.log(validation)
// console.log(validation.success)
// console.log(validation.error?.issues)
console.log('errors: ', validation.error?.issues?.map((issue) => issue?.message))