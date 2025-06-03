import React from 'react';

function SignalBars({ latency }) {
  // Determine active bars based on latency (lower is better)
  let activeBars = 4;
  if (latency > 200) activeBars = 1;
  else if (latency > 100) activeBars = 2;
  else if (latency > 50) activeBars = 3;
  else activeBars = 4;

  return (
    <div className="signal-bars flex gap-1 items-end group relative translate-y-[-5px]">
      {[...Array(4)].map((_, index) => (
        <div 
          key={index} 
          className={`rounded-sm w-[4px] ${index < activeBars ? 'bg-[#55FF55]' : 'bg-gray-700'} transition-colors duration-300`}
          style={{ height: `${8 + (index * 4)}px` }}
        />
      ))}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/75 text-white text-sm py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {latency} ms
      </div>
    </div>
  );
}

export default SignalBars;