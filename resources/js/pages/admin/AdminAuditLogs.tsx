import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, History, User, FileText, Settings, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
type Json = any;

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Json | null;
  user_agent: string | null;
  created_at: string;
}

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter, resourceFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    setLogs([]);
    setLoading(false);
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.resource_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.details)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (resourceFilter !== 'all') {
      filtered = filtered.filter(log => log.resource_type === resourceFilter);
    }

    setFilteredLogs(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'CREATE': return 'default';
      case 'UPDATE': return 'secondary';
      case 'DELETE': return 'destructive';
      case 'VIEW': return 'outline';
      case 'EXPORT': return 'secondary';
      default: return 'outline';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE': return 'তৈরি';
      case 'UPDATE': return 'আপডেট';
      case 'DELETE': return 'মুছে ফেলা';
      case 'VIEW': return 'দেখা';
      case 'EXPORT': return 'এক্সপোর্ট';
      case 'LOGIN': return 'লগইন';
      case 'LOGOUT': return 'লগআউট';
      default: return action;
    }
  };

  const getResourceLabel = (resource: string) => {
    switch (resource) {
      case 'user': return 'ব্যবহারকারী';
      case 'message': return 'বার্তা';
      case 'setting': return 'সেটিংস';
      case 'role': return 'রোল';
      case 'dashboard': return 'ড্যাশবোর্ড';
      case 'audit_log': return 'অডিট লগ';
      default: return resource;
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'user': return <User className="h-4 w-4" />;
      case 'message': return <FileText className="h-4 w-4" />;
      case 'setting': return <Settings className="h-4 w-4" />;
      case 'role': return <Shield className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">অডিট লগ</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8" />
            অডিট লগ
          </h1>
          <p className="text-muted-foreground">
            মোট {logs.length} টি অ্যাক্টিভিটি রেকর্ড
          </p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          রিফ্রেশ
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ফিল্টার</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="অ্যাকশন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব অ্যাকশন</SelectItem>
                <SelectItem value="VIEW">দেখা</SelectItem>
                <SelectItem value="CREATE">তৈরি</SelectItem>
                <SelectItem value="UPDATE">আপডেট</SelectItem>
                <SelectItem value="DELETE">মুছে ফেলা</SelectItem>
                <SelectItem value="EXPORT">এক্সপোর্ট</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="রিসোর্স" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব রিসোর্স</SelectItem>
                <SelectItem value="user">ব্যবহারকারী</SelectItem>
                <SelectItem value="message">বার্তা</SelectItem>
                <SelectItem value="setting">সেটিংস</SelectItem>
                <SelectItem value="role">রোল</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">কোন অডিট লগ পাওয়া যায়নি</p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      {getResourceIcon(log.resource_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                        <span className="text-sm font-medium">
                          {getResourceLabel(log.resource_type)}
                        </span>
                        {log.resource_id && (
                          <span className="text-xs text-muted-foreground font-mono">
                            #{log.resource_id.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(log.details).slice(0, 100)}
                          {JSON.stringify(log.details).length > 100 && '...'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(log.created_at)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      User: {log.user_id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
