export class ValueLimitExceededException extends Error {
  readonly code: string;
  readonly statusCode: number;
  constructor() {
    super('The transaction value exceeds the limit');
    this.name = 'ValueLimitExceededException';
    this.code = '1';
    this.statusCode = 422;
  }
}
