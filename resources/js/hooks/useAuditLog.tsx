import { useCallback } from 'react';
import { useAuth } from './useAuth';

export type AuditAction = 
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'BULK_ACTION';

export type ResourceType = 
  | 'user'
  | 'message'
  | 'setting'
  | 'role'
  | 'dashboard'
  | 'audit_log';

interface AuditLogEntry {
  action: AuditAction;
  resource_type: ResourceType;
  resource_id?: string;
  details?: any;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = useCallback(async (entry: AuditLogEntry): Promise<boolean> => {
    return true;
  }, [user]);

  const logView = useCallback((resource_type: ResourceType, resource_id?: string, details?: any) => {
    return logAction({ action: 'VIEW', resource_type, resource_id, details });
  }, [logAction]);

  const logCreate = useCallback((resource_type: ResourceType, resource_id?: string, details?: any) => {
    return logAction({ action: 'CREATE', resource_type, resource_id, details });
  }, [logAction]);

  const logUpdate = useCallback((resource_type: ResourceType, resource_id?: string, details?: any) => {
    return logAction({ action: 'UPDATE', resource_type, resource_id, details });
  }, [logAction]);

  const logDelete = useCallback((resource_type: ResourceType, resource_id?: string, details?: any) => {
    return logAction({ action: 'DELETE', resource_type, resource_id, details });
  }, [logAction]);

  return {
    logAction,
    logView,
    logCreate,
    logUpdate,
    logDelete,
  };
};
