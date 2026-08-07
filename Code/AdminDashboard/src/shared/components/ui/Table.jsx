import React from 'react';

export function Table({
  headers = [],
  children,
  className = ''
}) {
  return (
    <div className={`w-full overflow-x-auto border border-outline-variant rounded-lg bg-surface-container-lowest ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-surface-bright border-b border-outline-variant text-on-surface-variant font-medium uppercase text-[11px] tracking-wider">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant text-on-surface">
          {children}
        </tbody>
      </table>
    </div>
  );
}
