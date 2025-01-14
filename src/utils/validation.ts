import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDateOnly', async: false })
export class IsDateOnly implements ValidatorConstraintInterface {
  private _regex: RegExp;

  constructor() {
    this._regex = /^(?:(?:19|20)\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  }

  validate(
    value: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return (
      this._regex.test(value) && new Date(value).toString() !== 'Invalid Date'
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'date must be in the format YYYY-MM-DD';
  }
}
