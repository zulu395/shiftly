// src/components/CsvUploader.tsx
"use client";

import { useCsvParser } from "@/hooks/useCsvParser"; // Our custom hook
import type { ColumnMapping, CsvRow, MappedUserData } from "@/types/csv"; // Our types
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuCircleCheck, LuCircleX, LuCloudUpload } from "react-icons/lu"; // Icons
import AppSelect from "../form/AppSelect";

type CsvUploaderProps = {
  /**
   * Callback fired when mapped data (fullname, email) changes or is successfully parsed.
   * Provides an array of { fullname: string; email: string; }
   */
  onDataChange: (data: MappedUserData[]) => void;
};

/**
 * Component for uploading a CSV, mapping columns, and outputting structured data.
 */
export const CsvUploader: React.FC<CsvUploaderProps> = ({ onDataChange }) => {
  const { parsedData, headers, fileName, error, loading, parseFile, reset } =
    useCsvParser();

  // State for user's column selections
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    fullnameColumn: null,
    emailColumn: null,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          parseFile(file);
          // Reset mapping when a new file is uploaded
          setColumnMapping({ fullnameColumn: null, emailColumn: null });
        } else {
          // Clear previous state and show error for wrong file type
          reset();
          alert("Please upload a valid CSV file.");
        }
      }
    },
    [parseFile, reset]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"], // Common MIME type for CSV on Windows
    },
    multiple: false,
  });

  // Effect to re-evaluate and output data whenever parsedData or columnMapping changes
  useEffect(() => {
    if (
      parsedData &&
      columnMapping.fullnameColumn &&
      columnMapping.emailColumn
    ) {
      const mappedData: MappedUserData[] = parsedData
        .map((row: CsvRow) => {
          const fullname = row[columnMapping.fullnameColumn!];
          const email = row[columnMapping.emailColumn!];

          // Basic validation for non-empty values
          if (fullname && email) {
            return { fullname, email };
          }
          return null; // Exclude rows with missing data
        })
        .filter(Boolean) as MappedUserData[]; // Filter out nulls and assert type

      onDataChange(mappedData);
    } else {
      // If mapping is incomplete or data is not ready, clear parent data
      onDataChange([]);
    }
  }, [parsedData, columnMapping, onDataChange]);

  const handleColumnSelect = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping((prev) => ({ ...prev, [field]: value }));
  };

  // Render the initial dropzone UI
  if (!parsedData && !loading && !error) {
    return (
      <div
        {...getRootProps()}
        className={`
          flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg 
          text-center transition-colors duration-200 cursor-pointer h-64
          ${
            isDragActive
              ? "border-brand-primary bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }
          hover:border-brand-primary hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-brand-primary
        `}
      >
        <input {...getInputProps()} />
        <LuCloudUpload className="w-16 h-16 text-brand-primary mb-4" />
        <p className="text-lg font-medium text-gray-800">
          Drag and drop a file to upload
        </p>
        <p className="text-sm text-gray-500 mb-4">CSV file up to 10MB</p>
        <p className="text-gray-400 font-bold mb-4">OR</p>
        <button
          type="button"
          className="px-6 py-2 bg-brand-primary text-white rounded-md shadow-sm
                     hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Browse Files
        </button>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg shadow-sm bg-white h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-brand-primary border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">
          Parsing &quot;{fileName}&quot;...
        </p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg shadow-sm bg-red-50 text-red-700 h-64">
        <LuCircleX className="w-16 h-16 mb-4 text-red-500" />
        <p className="text-lg font-medium mb-2">{error}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render mapping UI after successful upload
  return (
    <div className="p-4 xl:p-6 border rounded-lg drop-shadow-xs bg-white">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-800">
            {fileName}
          </span>
          <LuCircleCheck className="w-5 h-5 text-brand-primary" />
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
        >
          <LuCircleX className="w-4 h-4" /> Reset
        </button>
      </div>

      <p className="text-gray-700 text-base mb-4 h5">
        Please map the columns from your CSV to the required fields.
      </p>

      {headers && (
        <div className="space-y-2">
          {/* Full Name Mapping */}
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="fullname-select"
              className="font-medium text-gray-700"
            >
              Full Name:
            </label>
            <AppSelect
              options={headers}
              name="__fullname"
              onChange={(e) => handleColumnSelect("fullnameColumn", e)}
              value={columnMapping.fullnameColumn || ""}
            />
          </div>

          {/* Email Mapping */}
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="email-select" className="font-medium text-gray-700">
              Email:
            </label>
            <AppSelect
              options={headers}
              name="__email"
              onChange={(e) => handleColumnSelect("emailColumn", e)}
              value={columnMapping.emailColumn || ""}
            />
          </div>
        </div>
      )}

      {/* Optional: Display a preview of the mapped data (first 5 rows) */}
      {columnMapping.fullnameColumn &&
        columnMapping.emailColumn &&
        parsedData &&
        parsedData.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="h5 font-semibold text-gray-800 mb-3">Preview:</h3>
            <div className="bg-gray-50 rounded-md overflow-x-auto text-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                        {row[columnMapping.fullnameColumn!] || "-"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                        {row[columnMapping.emailColumn!] || "-"}
                      </td>
                    </tr>
                  ))}
                  {parsedData.length > 5 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-2 text-center text-xs text-gray-500"
                      >
                        ... {parsedData.length - 5} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};
