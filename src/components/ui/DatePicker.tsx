import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { format } from 'date-fns';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  id: string;
  label?: string;
  error?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  className?: string;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      id,
      label,
      error,
      selected,
      onChange,
      dateFormat = 'dd-MMM-yyyy',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}
        <ReactDatePicker
          id={id}
          selected={selected}
          onChange={onChange}
          dateFormat={dateFormat}
          className={clsx(
            'block w-full rounded-md shadow-sm sm:text-sm',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            className
          )}
          customInput={<input ref={ref} />}
          isClearable
          {...props}
        />
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;