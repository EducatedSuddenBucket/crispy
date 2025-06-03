import React, { useEffect, useState } from 'react';
import SignalBars from './SignalBars';
import { parseMCFormatting } from '../utils/minecraftFormatter';

function ServerScanner({ serverAddress, showDivider = false, showScanning = true, refreshTrigger = false }) {
  const [serverData, setServerData] = useState(null);
  const [serverIcon, setServerIcon] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServerData();
    const interval = setInterval(fetchServerData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [serverAddress]);

  // Refresh when the refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchServerData();
    }
  }, [refreshTrigger]);

  const fetchServerData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      // Fetch server icon
      try {
        const iconResponse = await fetch(`https://heatblock.esb.is-a.dev/api/png/${serverAddress}`);
        if (iconResponse.ok) {
          const iconBlob = await iconResponse.blob();
          const iconUrl = URL.createObjectURL(iconBlob);
          setServerIcon(iconUrl);
        }
      } catch (error) {
        console.log('Failed to load server icon');
      }
      
      // Fetch server status
      const response = await fetch(`https://heatblock.esb.is-a.dev/api/status/${serverAddress}`);
      const data = await response.json();
      
      if (data.success) {
        setServerData(data);
      } else {
        setIsError(true);
        setServerData(null);
      }
    } catch (error) {
      setIsError(true);
      setServerData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 ${showDivider ? 'border-b-2 border-[#8B4B8C]/30' : ''}`}>
      <div className="header flex items-center">
        <div className="hypixel-icon min-w-[64px] w-16 h-16 mr-4 rounded bg-gray-800 overflow-hidden">
          {serverIcon && <img src={serverIcon} alt="Server Icon" className="w-full h-full" />}
        </div>
        
        <div className="server-info flex-grow">
          <div className="flex items-center justify-between">
            <div className="server-name text-white text-lg font-bold mb-1">{serverAddress}</div>
            <div className="flex items-center gap-2">
              {serverData && (
                <div className="player-count text-white text-base font-bold">
                  {serverData.players.online}/{serverData.players.max}
                </div>
              )}
              {serverData && <SignalBars latency={serverData.latency} />}
            </div>
          </div>
          {serverData && (
            <div className="server-details text-sm leading-tight">
              <div dangerouslySetInnerHTML={{ 
                __html: parseMCFormatting(serverData.description)
              }} />
            </div>
          )}
          {isError && (
            <div className="text-[#FF5555] text-sm">
              Failed to connect to server
            </div>
          )}
        </div>
      </div>
      
      {showScanning && (
        <div className="scanning-section mt-6">
          <div className="scanning-text text-white text-base mb-4 text-center">
            Scanning for games on your local network
          </div>
        </div>
      )}
    </div>
  );
}

export default ServerScanner;