import {
  registerDecorator,
  ValidatorOptions,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

interface IsFileOptions {
  mimeType?: string[];
  maxSize?: number;
}

export function IsFile(
  options: IsFileOptions,
  validationOptions?: ValidatorOptions,
) {
  return function (object: object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (options?.mimeType) {
            for (const mimeType of options.mimeType) {
              const re = new RegExp(`^${mimeType?.replace('*', '.*')}$`, 'g');
              if (!re.test(value?.mimeType)) {
                return false;
              }
            }
          }
          return true;
        },
      },
    });
  };
}

export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf(
    (_object, value) => ![undefined, null].includes(value),
    validationOptions,
  );
}
