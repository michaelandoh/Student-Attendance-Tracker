import React from 'react';
import { Bell, Clock, Users, CheckCircle, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'class_reminder':
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'attendance_alert':
      return <Users className="w-4 h-4 text-green-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onNavigate 
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (notification: Notification) => void;
}) => {
  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    onNavigate(notification);
  };

  return (
    <div 
      className={`relative p-4 border-b border-border/40 hover:bg-muted/30 transition-all duration-200 cursor-pointer group ${
        !notification.is_read ? 'bg-primary/5' : ''
      }`}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
      )}
      
      <div className="flex items-start gap-3 ml-4">
        {/* Icon */}
        <div className="p-2 bg-background rounded-xl border border-border/40 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground leading-snug">
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {notification.message}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {!notification.is_read && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  <CheckCircle className="w-3 h-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
            {notification.type === 'class_reminder' && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                Class Reminder
              </Badge>
            )}
            {notification.type === 'attendance_alert' && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Attendance
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationDropdown = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    // Navigate based on notification type
    if (notification.class_id) {
      navigate(`/class/${notification.class_id}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 rounded-xl hover:bg-muted transition-all duration-200"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs border-2 border-background"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-background/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/40 bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs hover:bg-primary/10 text-primary"
                onClick={() => markAllAsRead()}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-96">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">No notifications yet</p>
              <p className="text-xs text-muted-foreground/70">
                You'll see class reminders and attendance alerts here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.slice(0, 10).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onNavigate={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border/40 bg-card/30">
            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
              onClick={() => navigate('/notifications')}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};