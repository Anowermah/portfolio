import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { Search, Eye, UserPlus, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAuditLog } from '@/hooks/useAuditLog';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  phone: string;
  location: string;
  created_at: string;
  updated_at: string;
  roles?: string[];
}

const AdminUsers = () => {
  const { user } = useAuth();
  const { logView, logCreate, logDelete } = useAuditLog();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [roleToRemove, setRoleToRemove] = useState<{ userId: string; role: string; userName: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('ব্যবহারকারী তথ্য লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const assignRole = async (userId: string, role: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success(res.data?.message || 'রোল সফলভাবে পরিবর্তন করা হয়েছে');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'রোল আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const removeRole = async (userId: string, role: string) => {
    try {
      const newRole = role === 'admin' ? 'client' : 'client';
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(res.data?.message || 'রোল পরিবর্তন করা হয়েছে');
      setRoleToRemove(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'রোল আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleViewUser = (userProfile: UserProfile) => {
    setSelectedUser(userProfile);
    // Log view action
    logView('user', userProfile.user_id, { display_name: userProfile.display_name });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'অ্যাডমিন';
      case 'moderator': return 'মডারেটর';
      case 'user': return 'ব্যবহারকারী';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">ব্যবহারকারী ব্যবস্থাপনা</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Admin Role Removal Confirmation Dialog */}
      <AlertDialog open={!!roleToRemove} onOpenChange={(open) => !open && setRoleToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              অ্যাডমিন রোল সরানোর নিশ্চিতকরণ
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                আপনি কি নিশ্চিত যে <strong>{roleToRemove?.userName}</strong> থেকে <strong className="text-destructive">অ্যাডমিন</strong> রোল সরাতে চান?
              </p>
              <p className="text-destructive font-medium">
                ⚠️ সতর্কতা: এই ব্যবহারকারী অ্যাডমিন প্যানেল এবং সকল অ্যাডমিন ফিচার অ্যাক্সেস হারাবে।
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roleToRemove && removeRole(roleToRemove.userId, roleToRemove.role)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              হ্যাঁ, রোল সরান
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ব্যবহারকারী ব্যবস্থাপনা</h1>
          <p className="text-muted-foreground">মোট {users.length} জন নিবন্ধিত ব্যবহারকারী</p>
        </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>অনুসন্ধান</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="নাম, ফোন বা ঠিকানা দিয়ে অনুসন্ধান করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">কোন ব্যবহারকারী পাওয়া যায়নি</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} alt={user.display_name} />
                      <AvatarFallback>
                        {user.display_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.display_name || 'নাম নেই'}</h3>
                        <div className="flex gap-1">
                          {user.roles?.map((role) => (
                            <Badge key={role} variant={getRoleBadgeVariant(role)}>
                              {getRoleLabel(role)}
                            </Badge>
                          ))}
                          {user.roles?.length === 0 && (
                            <Badge variant="outline">সাধারণ ব্যবহারকারী</Badge>
                          )}
                        </div>
                      </div>
                      
                      {user.phone && (
                        <p className="text-sm text-muted-foreground">📞 {user.phone}</p>
                      )}
                      
                      {user.location && (
                        <p className="text-sm text-muted-foreground">📍 {user.location}</p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        যোগদান: {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          বিস্তারিত
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>ব্যবহারকারীর তথ্য</DialogTitle>
                          <DialogDescription>
                            {selectedUser?.display_name} এর সম্পূর্ণ প্রোফাইল
                          </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.display_name} />
                                <AvatarFallback>
                                  {selectedUser.display_name?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-lg font-semibold">{selectedUser.display_name}</h3>
                                <div className="flex gap-1 mt-1">
                                  {selectedUser.roles?.map((role) => (
                                    <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                      {getRoleLabel(role)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {selectedUser.bio && (
                              <div>
                                <strong>বায়ো:</strong>
                                <p className="mt-1 text-muted-foreground">{selectedUser.bio}</p>
                              </div>
                            )}
                            
                            {selectedUser.phone && (
                              <div>
                                <strong>ফোন:</strong> {selectedUser.phone}
                              </div>
                            )}
                            
                            {selectedUser.location && (
                              <div>
                                <strong>ঠিকানা:</strong> {selectedUser.location}
                              </div>
                            )}
                            
                            <div>
                              <strong>যোগদানের তারিখ:</strong> {formatDate(selectedUser.created_at)}
                            </div>
                            
                            <div>
                              <strong>সর্বশেষ আপডেট:</strong> {formatDate(selectedUser.updated_at)}
                            </div>

                            {/* Role Management */}
                            <div className="space-y-3 pt-4 border-t">
                              <h4 className="font-medium">রোল ম্যানেজমেন্ট</h4>
                              <div className="flex gap-2">
                                <Select onValueChange={(role) => assignRole(selectedUser.user_id, role)}>
                                  <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="রোল অ্যাসাইন করুন" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">অ্যাডমিন</SelectItem>
                                    <SelectItem value="moderator">মডারেটর</SelectItem>
                                    <SelectItem value="user">ব্যবহারকারী</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {selectedUser.roles && selectedUser.roles.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">বর্তমান রোলসমূহ:</p>
                                  <div className="flex gap-2">
                                     {selectedUser.roles.map((role) => (
                                       <div key={role} className="flex items-center gap-2">
                                         <Badge variant={getRoleBadgeVariant(role)}>
                                           {getRoleLabel(role)}
                                         </Badge>
                                         <Button
                                           variant="ghost"
                                           size="sm"
                                           onClick={() => handleRemoveRoleClick(selectedUser.user_id, role, selectedUser.display_name)}
                                           className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                         >
                                           ×
                                         </Button>
                                       </div>
                                     ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </>
  );
};

export default AdminUsers;