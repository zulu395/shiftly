// src/types/csv.ts

/**
 * The structure of each row after CSV parsing,
 * where keys are column headers and values are cell data.
 */
export type CsvRow = { [key: string]: string };

/**
 * The final, processed data structure passed to onDataChange.
 * Contains mapped 'fullname' and 'email'.
 */
export type MappedUserData = {
  fullname: string;
  email: string;
};

/**
 * Defines the current column selections made by the user.
 */
export type ColumnMapping = {
  fullnameColumn: string | null;
  emailColumn: string | null;
};