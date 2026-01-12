import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-xl border bg-white">
      <span className="text-sm font-medium text-slate-600">Counter</span>

      <div className="text-4xl font-semibold text-slate-900">
        {count}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCount(c => c - 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Decrement counter"
        >
          −
        </button>

        <button
          onClick={() => setCount(c => c + 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Increment counter"
        >
          +
        </button>
      </div>
    </div>
  );
}
