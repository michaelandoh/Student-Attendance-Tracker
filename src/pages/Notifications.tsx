import React from 'react';
import { Bell, Clock, Users, CheckCircle, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'class_reminder':
      return <Clock className="w-5 h-5 text-blue-500" />;
    case 'attendance_alert':
      return <Users className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />;
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
    <Card 
      className={`relative transition-all duration-200 cursor-pointer hover:shadow-md ${
        !notification.is_read ? 'bg-primary/5 border-primary/20' : ''
      }`}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4 ml-4">
          {/* Icon */}
          <div className="p-3 bg-background rounded-xl border border-border/40 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground leading-snug mb-2">
                  {notification.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {notification.message}
                </p>
                
                {/* Timestamp and badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {notification.type === 'class_reminder' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Class Reminder
                      </Badge>
                    )}
                    {notification.type === 'attendance_alert' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Attendance
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                {!notification.is_read && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-destructive/10 text-destructive border-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Notifications() {
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
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={() => markAllAsRead()}
                  className="hover:bg-primary/10 text-primary"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Notifications List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
              <p className="text-muted-foreground">Loading notifications...</p>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No notifications yet</h3>
              <p className="text-muted-foreground">
                You'll see class reminders and attendance alerts here when they're available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
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
      </div>
    </div>
  );
}