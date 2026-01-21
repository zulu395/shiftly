// src/hooks/useCsvParser.ts
import { useState, useCallback } from 'react';
import { parse } from 'csv-parse/browser/esm';
import type { CsvRow } from '@/types/csv'; 

type UseCsvParserResult = {
  parsedData: CsvRow[] | null;
  headers: string[] | null;
  fileName: string | null;
  error: string | null;
  loading: boolean;
  parseFile: (file: File) => void;
  reset: () => void;
};

/**
 * Custom hook to handle reading and parsing a CSV file.
 */
export const useCsvParser = (): UseCsvParserResult => {
  const [parsedData, setParsedData] = useState<CsvRow[] | null>(null);
  const [headers, setHeaders] = useState<string[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setParsedData(null);
    setHeaders(null);
    setFileName(null);
    setError(null);
    setLoading(false);
  }, []);

  const parseFile = useCallback((file: File) => {
    setLoading(true);
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      parse(
        text,
        {
          columns: true, // Treat the first row as column headers
          skip_empty_lines: true,
          trim: true,
        },
        (err, records: CsvRow[]) => {
          setLoading(false);
          if (err) {
            console.error('CSV parsing error:', err);
            setError(`Failed to parse CSV: ${err.message}`);
            setParsedData(null);
            setHeaders(null);
            return;
          }

          if (records.length === 0) {
            setError('CSV file is empty or contains no data rows.');
            setParsedData(null);
            setHeaders(null);
            return;
          }

          // Extract headers from the first record if available, or from `columns` option if true
          const extractedHeaders = Object.keys(records[0] || {});
          setHeaders(extractedHeaders);
          setParsedData(records);
        }
      );
    };

    reader.onerror = () => {
      setLoading(false);
      setError('Failed to read file.');
      setParsedData(null);
      setHeaders(null);
    };

    reader.readAsText(file);
  }, []);

  return { parsedData, headers, fileName, error, loading, parseFile, reset };
};