import { ResultAsync } from 'neverthrow'
import { ZodError, ZodObject, ZodRawShape } from 'zod'

export const parseAsync = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: unknown
) =>
  ResultAsync.fromPromise(
    schema.parseAsync(data),
    (error: any): ZodError[] => error.issues
  )
