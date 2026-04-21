import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { getNotifications, getUser, markAllNotificationsRead } from "@/lib/annaStore";
import { Bell, BellOff } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const user = getUser();
  const all = getNotifications().filter(n => n.forRole === "all" || n.forRole === user?.role);

  useEffect(() => { markAllNotificationsRead(); }, []);

  return (
    <PhoneFrame title="Notifications" subtitle="അലേർട്ടുകൾ">
      {all.length === 0 ? (
        <div className="text-center py-16 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
            <BellOff className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl text-maroon mb-1">All caught up</h3>
          <p className="text-sm text-muted-foreground">You'll see donation alerts and updates here.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {all.map(n => (
            <button
              key={n.id}
              onClick={() => n.donationId && navigate(`/app/track/${n.donationId}`)}
              className="w-full kerala-card p-3.5 text-left flex gap-3 animate-fade-up"
            >
              <div className="w-9 h-9 rounded-full gradient-leaf flex items-center justify-center text-primary-foreground shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-maroon">{n.title}</p>
                <p className="text-xs text-foreground/75 leading-snug">{n.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(n.at).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </PhoneFrame>
  );
};

export default Notifications;
