import React, { useState, useEffect } from 'react';
import ServerScanner from './components/ServerScanner';
import { Plus, X, RotateCw } from 'lucide-react';
import ScanningIndicator from './components/ScanningIndicator';

function App() {
  const [servers, setServers] = useState([]);
  const [showAddServer, setShowAddServer] = useState(false);
  const [newServerAddress, setNewServerAddress] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const savedServers = localStorage.getItem('minecraft-servers');
    if (!savedServers) {
      // Add default Hypixel server
      const defaultServer = { address: 'mc.hypixel.net', addedAt: Date.now() };
      setServers([defaultServer]);
      localStorage.setItem('minecraft-servers', JSON.stringify([defaultServer]));
    } else {
      const parsedServers = JSON.parse(savedServers);
      setServers(parsedServers);
    }
  }, []);

  const addServer = () => {
    if (!newServerAddress.trim()) return;
    
    const newServer = {
      address: newServerAddress.trim(),
      addedAt: Date.now()
    };
    
    const updatedServers = [...servers, newServer];
    setServers(updatedServers);
    localStorage.setItem('minecraft-servers', JSON.stringify(updatedServers));
    
    setNewServerAddress('');
    setShowAddServer(false);
  };

  const removeServer = (address) => {
    if (servers.length <= 1) return; // Prevent removing the last server
    
    const updatedServers = servers.filter(s => s.address !== address);
    setServers(updatedServers);
    localStorage.setItem('minecraft-servers', JSON.stringify(updatedServers));
  };

  const refreshAllServers = () => {
    setIsRefreshing(true);
    // The ServerScanner components will auto-refresh when this prop changes
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-8" 
         style={{ backgroundImage: "url('/assets/bg-5.png')" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowAddServer(true)}
            className="bg-[#55FF55] hover:bg-[#77FF77] text-black px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={24} />
            Add Server
          </button>
          <button
            onClick={refreshAllServers}
            disabled={isRefreshing}
            className={`bg-[#55FF55] hover:bg-[#77FF77] text-black px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isRefreshing ? 'opacity-50' : ''}`}
          >
            <RotateCw size={24} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh All
          </button>
        </div>

        {showAddServer && (
          <div className="bg-black/30 border-2 border-[#8B4B8C] rounded-lg p-6 mb-6">
            <input
              type="text"
              value={newServerAddress}
              onChange={(e) => setNewServerAddress(e.target.value)}
              placeholder="Enter server address..."
              className="w-full bg-black/50 text-white border-2 border-[#8B4B8C] rounded px-4 py-2 mb-4"
              onKeyDown={(e) => e.key === 'Enter' && addServer()}
            />
            <div className="flex gap-4">
              <button
                onClick={addServer}
                className="bg-[#55FF55] hover:bg-[#77FF77] text-black px-6 py-2 rounded"
              >
                Add Server
              </button>
              <button
                onClick={() => {
                  setShowAddServer(false);
                  setNewServerAddress('');
                }}
                className="bg-[#FF5555] hover:bg-[#FF7777] text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex">
          <div className="bg-black/30 border-2 border-[#8B4B8C] rounded-lg overflow-hidden flex-grow">
            {servers.map((server, index) => (
              <ServerScanner 
                key={server.address}
                serverAddress={server.address} 
                showDivider={index !== servers.length - 1}
                showScanning={false}
                refreshTrigger={isRefreshing}
              />
            ))}
            <div className="scanning-section p-6 border-t-2 border-[#8B4B8C]/30">
              <div className="scanning-text text-white text-base mb-4 text-center">
                Scanning for games on your local network
              </div>
              <ScanningIndicator />
            </div>
          </div>
          <div className="flex flex-col gap-6 ml-4">
            {servers.map((server) => (
              <div key={`remove-${server.address}`} className="h-[96px] flex items-center">
                {servers.length > 1 && (
                  <button
                    onClick={() => removeServer(server.address)}
                    className="text-[#FF5555] hover:text-[#FF7777] transition-colors bg-black/30 p-2 rounded-lg border-2 border-[#8B4B8C]"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;