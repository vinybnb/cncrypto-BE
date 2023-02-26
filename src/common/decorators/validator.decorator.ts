import {
  registerDecorator,
  ValidationArguments,
  ValidatorOptions,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

interface IsFileOptions {
  mimeType?: string[];
}

export function IsFile(
  options: IsFileOptions,
  validationOptions?: ValidatorOptions,
) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (options?.mimeType) {
            for (const mimeType of options.mimeType) {
              const re = new RegExp(`^${mimeType?.replace('*', '.*')}$`, 'g');
              console.log(`^${mimeType?.replace('*', '.*')}$`, value);
              console.log(re.test(value?.mimeType));
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
