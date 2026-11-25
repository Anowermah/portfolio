import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/api';
import { Search, Eye, Check, X, Mail, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuditLog } from '@/hooks/useAuditLog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
  read_status: boolean;
  reply_sent: boolean;
}

const AdminMessages = () => {
  const { logView, logUpdate, logDelete } = useAuditLog();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('বার্তা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === 'unread') {
      filtered = filtered.filter(message => !message.read_status);
    } else if (statusFilter === 'read') {
      filtered = filtered.filter(message => message.read_status);
    }

    setFilteredMessages(filtered);
  };

  const markAsRead = async (messageId: string | number) => {
    try {
      await api.patch(`/admin/messages/${messageId}/read`);
      setMessages(prev => 
        prev.map(msg => 
          String(msg.id) === String(messageId) ? { ...msg, read_status: true } : msg
        )
      );
      toast.success('বার্তা পঠিত হিসেবে চিহ্নিত হয়েছে');
    } catch (error) {
      toast.error('বার্তা আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const markAsUnread = async (messageId: string | number) => {
    toast.info('এই ফিচারটি প্রয়োজন হলে যুক্ত করা হবে');
  };

  const deleteMessage = async (messageId: string | number) => {
    try {
      await api.delete(`/admin/messages/${messageId}`);
      setMessages(prev => prev.filter(msg => String(msg.id) !== String(messageId)));
      toast.success('বার্তা সফলভাবে মুছে ফেলা হয়েছে');
    } catch (error) {
      toast.error('বার্তা মুছতে সমস্যা হয়েছে');
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    // Log view action
    logView('message', message.id, { subject: message.subject });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">যোগাযোগের বার্তা</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">যোগাযোগের বার্তা</h1>
        <p className="text-muted-foreground">
          মোট {messages.length} টি বার্তা ({messages.filter(m => !m.read_status).length} টি অপঠিত)
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ফিল্টার ও অনুসন্ধান</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="নাম, ইমেইল বা বিষয় দিয়ে অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl">
                <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব বার্তা ({messages.length})</SelectItem>
                <SelectItem value="unread">অপঠিত ({messages.filter(m => !m.read_status).length})</SelectItem>
                <SelectItem value="read">পঠিত ({messages.filter(m => m.read_status).length})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <Card className="rounded-2xl border border-border">
            <CardContent className="text-center py-12">
              <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground font-medium text-sm">কোনো বার্তা খুঁজে পাওয়া যায়নি</p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`rounded-2xl border transition-all ${
                !message.read_status 
                  ? "border-amber-500/50 bg-amber-500/5 shadow-xs" 
                  : "border-border/80 bg-card hover:bg-muted/10"
              }`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-foreground">{message.name}</h3>
                      <Badge 
                        variant={message.read_status ? "secondary" : "destructive"}
                        className="text-[10px] px-2 py-0.2"
                      >
                        {message.read_status ? "পঠিত" : "অপঠিত"}
                      </Badge>
                      {message.phone && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                          <Phone className="w-3 h-3" />
                          <span>{message.phone}</span>
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="text-primary font-medium">{message.email}</span>
                      {message.phone && (
                        <button
                          type="button"
                          onClick={() => {
                            const raw = message.phone || '';
                            const clean = raw.replace(/[^0-9]/g, '');
                            const target = clean.startsWith('88') ? clean : '88' + clean;
                            const text = encodeURIComponent(`আসসালামু আলাইকুম ${message.name}! আপনার পাঠানো বার্তার ("${message.subject}") প্রেক্ষিতে যোগাযোগ করছি। আমি মো: আনোয়ার হোসাইন...`);
                            window.open(`https://wa.me/${target}?text=${text}`, '_blank');
                          }}
                          className="text-emerald-600 hover:underline font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp খুলুন</span>
                        </button>
                      )}
                    </div>
                    <p className="font-semibold text-xs sm:text-sm text-foreground">{message.subject}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                  
                  {/* Action buttons (Responsive: wrap on mobile, inline on desktop) */}
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    {message.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs rounded-lg gap-1 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 shadow-xs"
                        onClick={() => {
                          const raw = message.phone || '';
                          const clean = raw.replace(/[^0-9]/g, '');
                          const target = clean.startsWith('88') ? clean : '88' + clean;
                          const text = encodeURIComponent(`আসসালামু আলাইকুম ${message.name}! আপনার পাঠানো বার্তার ("${message.subject}") প্রেক্ষিতে যোগাযোগ করছি। আমি মো: আনোয়ার হোসাইন...`);
                          window.open(`https://wa.me/${target}?text=${text}`, '_blank');
                        }}
                        title="সরাসরি WhatsApp-এ কথা বলুন"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </Button>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs rounded-lg gap-1 border-border shadow-xs"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-3.5 w-3.5 text-primary" />
                          <span>দেখুন</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-lg">বার্তার বিস্তারিত</DialogTitle>
                          <DialogDescription className="text-xs">
                            {selectedMessage?.name} এর পাঠানো বার্তা
                          </DialogDescription>
                        </DialogHeader>
                        {selectedMessage && (
                          <div className="space-y-4 pt-2">
                            <div className="p-3.5 rounded-xl bg-muted/40 space-y-1.5 text-xs">
                              <div><strong className="text-muted-foreground">প্রেরক:</strong> <span className="text-foreground font-semibold">{selectedMessage.name}</span></div>
                              {selectedMessage.phone && (
                                <div><strong className="text-muted-foreground">ফোন / WhatsApp:</strong> <span className="text-emerald-600 font-bold ml-1">{selectedMessage.phone}</span></div>
                              )}
                              <div><strong className="text-muted-foreground">ইমেইল:</strong> <span className="text-foreground font-semibold">{selectedMessage.email}</span></div>
                              <div><strong className="text-muted-foreground">বিষয়:</strong> <span className="text-foreground font-semibold">{selectedMessage.subject}</span></div>
                              <div><strong className="text-muted-foreground">সময়:</strong> <span className="text-foreground">{formatDate(selectedMessage.created_at)}</span></div>
                            </div>

                            <div>
                              <strong className="text-xs text-muted-foreground">বার্তা:</strong>
                              <p className="mt-1.5 p-3.5 bg-muted/20 border border-border rounded-xl whitespace-pre-wrap text-xs text-foreground leading-relaxed">
                                {selectedMessage.message}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                              <Button
                                size="sm"
                                className="text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                                onClick={() => {
                                  const raw = selectedMessage.phone || '';
                                  const clean = raw.replace(/[^0-9]/g, '');
                                  const target = clean ? (clean.startsWith('88') ? clean : '88' + clean) : '';
                                  const text = encodeURIComponent(`আসসালামু আলাইকুম ${selectedMessage.name}! আপনার পাঠানো বার্তার ("${selectedMessage.subject}") প্রেক্ষিতে যোগাযোগ করছি। আমি মো: আনোয়ার হোসাইন...`);
                                  window.open(`https://wa.me/${target}?text=${text}`, '_blank');
                                }}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp রিপ্লাই</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs rounded-xl gap-1.5"
                                onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                              >
                                <Mail className="w-3.5 h-3.5 text-primary" />
                                <span>ইমেইলে উত্তর</span>
                              </Button>

                              {!selectedMessage.read_status && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="text-xs rounded-xl gap-1.5"
                                  onClick={() => markAsRead(selectedMessage.id)}
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>পঠিত করুন</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {!message.read_status ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs rounded-lg gap-1 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 shadow-xs"
                        onClick={() => markAsRead(message.id)}
                        title="পঠিত চিহ্নিত করুন"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">পঠিত</span>
                      </Button>
                    ) : null}

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 text-xs rounded-lg gap-1 border-primary/30 text-primary hover:bg-primary/10 shadow-xs"
                      onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}
                      title="ইমেইল পাঠান"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">ইমেইল</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm("আপনি কি নিশ্চিতভাবে এই বার্তাটি মুছে ফেলতে চান?")) {
                          deleteMessage(message.id);
                        }
                      }}
                      className="h-8 text-xs rounded-lg text-destructive hover:bg-destructive/10 border-destructive/30 shadow-xs"
                      title="মুছে ফেলুন"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">মুছুন</span>
                    </Button>
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

export default AdminMessages;