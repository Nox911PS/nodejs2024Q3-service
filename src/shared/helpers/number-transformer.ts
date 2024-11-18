import { ValueTransformer } from 'typeorm';

export class NumberTransformer implements ValueTransformer {
  to(value: number): number {
    return value;
  }

  from(value: string): number {
    return parseInt(value, 10);
  }
}
