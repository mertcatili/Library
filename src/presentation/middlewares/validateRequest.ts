import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function validateRequest(dtoClass: any) {
    return function(req: Request, res: Response, next: NextFunction) {
        const dtoObject = plainToClass(dtoClass, req.body);
        validate(dtoObject).then(errors => {
            if (errors.length > 0) {
                const errorMessages = errors.map(error => Object.values(error)).flat();
                return res.status(400).json({ errors: errorMessages });
            } else {
                req.body = dtoObject;
                next();
            }
        });
    };
}