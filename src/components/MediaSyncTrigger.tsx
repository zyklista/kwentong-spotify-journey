import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SyncStatus {
  platform: string;
  sync_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  last_sync_at: string | null;
  error_message: string | null;
}

const MediaSyncTrigger = () => {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchSyncStatuses();
    
    // Set up interval to check sync status every 30 seconds
    const interval = setInterval(fetchSyncStatuses, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSyncStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('media_sync_status')
        .select('*');

      if (error) {
        console.error('Error fetching sync statuses:', error);
      } else {
        // Map database columns to interface properties
        const mappedData: SyncStatus[] = (data || []).map(item => ({
          platform: item.platform,
          sync_status: item.sync_status as 'pending' | 'in_progress' | 'completed' | 'failed',
          last_sync_at: item.last_sync_at,
          error_message: item.error_message
        }));
        setSyncStatuses(mappedData);
      }
    } catch (error) {
      console.error('Error fetching sync statuses:', error);
    }
  };

  const triggerSync = async (platform?: string) => {
    setIsSyncing(true);
    
    try {
      const { error } = await supabase.functions.invoke('media-sync', {
        body: { platform: platform || null, force: true }
      });

      if (error) {
        console.error('Error triggering sync:', error);
        toast.error(`Failed to sync ${platform || 'all platforms'}`);
      } else {
        toast.success(`Sync started for ${platform || 'all platforms'}`);
        fetchSyncStatuses(); // Refresh status immediately
      }
    } catch (error) {
      console.error('Error triggering sync:', error);
      toast.error('Failed to trigger sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="hidden lg:fixed lg:bottom-6 lg:right-6 lg:flex flex-col gap-2 bg-card border rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">Media Sync Status</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => triggerSync()}
          disabled={isSyncing}
          className="h-8 px-2"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-2">
        {syncStatuses.map((status) => (
          <div key={status.platform} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.sync_status)}
              <span className="capitalize">{status.platform}</span>
            </div>
            <div className="text-muted-foreground">
              {formatLastSync(status.last_sync_at)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => triggerSync('spotify')}
          disabled={isSyncing}
          className="flex-1 text-xs h-8"
        >
          Sync Spotify
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => triggerSync('youtube')}
          disabled={isSyncing}
          className="flex-1 text-xs h-8"
        >
          Sync YouTube
        </Button>
      </div>
    </div>
  );
};

export default MediaSyncTrigger;