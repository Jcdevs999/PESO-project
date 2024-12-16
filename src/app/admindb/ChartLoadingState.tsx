import React from 'react';
import { Loader2 } from 'lucide-react'

const ChartLoadingState = ({ height = 'h-full', text = 'Loading data...' }) => {
  return (
    <div className={`w-full ${height} flex flex-col items-center justify-center bg-gray-50/50`}>
      <Loader2 className="h-8 w-8 animate-spin text-green-500 text-xl" />
      <p className="mt-2 text-sm text-gray-500">FETCHING DATA...</p>
    </div>
  );
};

export default ChartLoadingState;