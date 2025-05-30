import { format, differenceInYears, parse } from 'date-fns';

/**
 * Format a date to DD-MMM-YYYY (e.g., 15-Jan-2023)
 */
export const formatDate = (date: Date): string => {
  return format(date, 'dd-MMM-yyyy');
};

/**
 * Parse a date string in DD-MMM-YYYY format
 */
export const parseFormattedDate = (dateString: string): Date => {
  return parse(dateString, 'dd-MMM-yyyy', new Date());
};

/**
 * Check if the user is at least 18 years old
 */
export const isAdult = (dateOfBirth: Date): boolean => {
  return differenceInYears(new Date(), dateOfBirth) >= 18;
};

/**
 * Validate a PDF file
 * - Must be a PDF
 * - Size between 10KB and 1MB
 */
export const validatePdfFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF' };
  }
  
  // Check file size (in bytes)
  const minSize = 10 * 1024; // 10KB
  const maxSize = 1024 * 1024; // 1MB
  
  if (file.size < minSize) {
    return { valid: false, error: 'File must be at least 10KB' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File must be less than 1MB' };
  }
  
  return { valid: true };
};