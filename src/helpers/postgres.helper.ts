export enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  CHECK_VIOLATION = '23514',
  NOT_NULL_VIOLATION = '23502',
  EXCLUSION_VIOLATION = '23P01',
}
