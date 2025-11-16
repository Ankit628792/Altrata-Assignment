import React, { useMemo } from 'react';

interface CalendarProps {
  date: Date;
}

interface DateData {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isHighlighted: boolean;
}


/**
 * Generate an array of DateData objects to populate the 6-row calendar grid (42 cells).
 * @param date The reference date (used to determine the month and year).
 * @returns An array of DateData objects representing the calendar days.
 */
const generateCalendarData = (date: Date): DateData[] => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const highlightedDay = date.getDate();

  const calendarDays: DateData[] = [];

  // 1. Calculate the first day of the current month
  const firstDayOfMonth = new Date(year, month, 1);
  // dayIndex: 0 (Sunday) to 6 (Saturday)
  const dayIndex = firstDayOfMonth.getDay();

  // 2. Calculate the number of days from the previous month needed
  const daysFromPrevMonth = dayIndex; // If month starts on Mon (1), we need 1 prev day. If Sun (0), we need 0 prev days.

  // 3. Get the last day of the *previous* month
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  // --- DAYS FROM PREVIOUS MONTH ---
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const day = lastDayOfPrevMonth - daysFromPrevMonth + i + 1;
    const date = new Date(year, month - 1, day);
    calendarDays.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: false,
      isHighlighted: false,
    });
  }

  // 4. Get the number of days in the *current* month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // --- DAYS FROM CURRENT MONTH ---
  for (let day = 1; day <= daysInMonth; day++) {
    const isHighlighted = day === highlightedDay;
    const date = new Date(year, month, day);
    calendarDays.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: true,
      isHighlighted,
    });
  }

  // --- DAYS FROM NEXT MONTH ---
  // The grid must contain 42 cells (6 weeks * 7 days)
  const remainingCells = 42 - calendarDays.length;

  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: false,
      isHighlighted: false,
    });
  }

  return calendarDays;
};


// Component for the header displaying Month and Year
const Header: React.FC<{ date: Date }> = ({ date }) => {
  const monthName = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return (
    <div className="text-center text-xl font-semibold mb-4 text-gray-100 tracking-wider">
      {monthName} {year}
    </div>
  );
};

// Component for the row displaying days of the week (Su, Mo, Tu, etc.)
const DaysOfWeek: React.FC = () => {
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return (
    <div className="grid grid-cols-7 gap-1">
      {dayNames.map((day) => (
        <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
          {day}
        </div>
      ))}
    </div>
  );
};

// Component for a single date cell
const DateCell: React.FC<{ data: DateData }> = ({ data }) => {
  const { dayOfMonth, isCurrentMonth, isHighlighted } = data;

  const cellClasses = [
    'text-center',
    'p-2',
    'rounded-lg',
    'transition-all',
    'duration-150',
    'select-none',
    'w-full', 
    'h-full', 
    'flex',
    'items-center',
    'justify-center',
    'aspect-square', 
    // Non-current month styling
    !isCurrentMonth && 'text-gray-600',
    // Current month styling
    isCurrentMonth && 'text-gray-200 hover:bg-gray-700 cursor-pointer',
    // Highlighted date styling
    isHighlighted && isCurrentMonth && 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-900/50',
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClasses}>
      <span className="text-base">{dayOfMonth}</span>
    </div>
  );
};
/**
 * A reusable calendar component that displays a calendar grid for the given date's month and year,
 * highlighting the specific day provided.
 */
export const Calendar: React.FC<CalendarProps> = ({ date }) => {
  // Memoize the data generation to prevent unnecessary recalculations on re-render
  const calendarData = useMemo(() => generateCalendarData(date), [date]);

  // Ensure the date prop is valid before rendering
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return <div className="p-4 text-red-500 bg-red-900/20 rounded-xl">Invalid Date Prop provided.</div>;
  }

  return (
    <div className="flex justify-center p-6 sm:p-8 bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl font-['Inter']">
        {/* Calendar Header (Month Year) */}
        <Header date={date} />

        {/* Days of the Week Header (Su-Sa) */}
        <DaysOfWeek />

        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-1 mt-1">
          {calendarData.map((data, index) => (
            <DateCell key={index} data={data} />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
            Highlighted Date: {date.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

/**
 * Main application component to demonstrate the Calendar component.
 */
const App: React.FC = () => {
  
  const dateOctober = new Date('2022-10-03T00:00:00'); // Example 1
  const dateMarch = new Date('2020-03-23T00:00:00');   // Example 2
  const dateCurrent = new Date();                     // Current Date

  return (
    <section className="p-4 space-y-8 bg-gray-900 w-full">
      <h1 className="text-3xl font-bold text-center text-white pt-8 pb-4">Reusable Calendar Component Showcase</h1>
      {/* Example 1: October 2022 */}
      <div className="flex justify-center">
        <div className="max-w-md w-full">
            <p className="text-gray-400 text-center">Displaying: October 3, 2022</p>
            <Calendar date={dateOctober} />
        </div>
      </div>

      {/* Example 2: March 2020 */}
      <div className="flex justify-center">
        <div className="max-w-md w-full">
            <p className="text-gray-400 text-center">Displaying: March 23, 2020</p>
            <Calendar date={dateMarch} />
        </div>
      </div>

      {/* Example 3: Current Month */}
      <div className="flex justify-center pb-8">
        <div className="max-w-md w-full">
            <p className="text-gray-400 text-center">Displaying: Today</p>
            <Calendar date={dateCurrent} />
        </div>
      </div>
    </section>
  );
};

export default App;