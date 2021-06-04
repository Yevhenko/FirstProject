import { NextFunction, Response } from 'express';
import { ModifiedRequest, RequestSchema } from '../constants/interface';

export const validateRequest =
  (schema: RequestSchema) =>
  async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const map = await Promise.all(
      Object.entries(schema).map(async ([schemaId, schema]) => [
        schemaId,
        //@ts-expect-error
        await schema.safeParseAsync(req[schemaId]),
      ]),
    );

    const data = map.reduce(
      (acc: { succeeded: Array<any>; failed: Array<any> }, [schemaId, result]) => {
        result.success ? acc.succeeded.push([schemaId, result.data]) : acc.failed.push([schemaId, result.error]);

        return acc;
      },
      { succeeded: [], failed: [] },
    );

    if (data.failed.length > 0) {
      res.status(400).json({
        Errors: Object.fromEntries(data.failed),
      });
    } else {
      data.succeeded.forEach(([schemaId, data]) => {
        //@ts-expect-error
        req[schemaId] = data;
      });
    }
    next();
  };
