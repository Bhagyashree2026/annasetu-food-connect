import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Bell, User, Package, ArrowLeft } from "lucide-react";
import { AnnaSetuLogo } from "@/components/AnnaSetuLogo";
import { getUser, getNotifications, useAnnaStore } from "@/lib/annaStore";

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  hideTabs?: boolean;
  hideHeader?: boolean;
}

export const PhoneFrame = ({ children, title, subtitle, showBack, hideTabs, hideHeader }: Props) => {
  useAnnaStore();
  const navigate = useNavigate();
  const loc = useLocation();
  const user = getUser();
  const unread = getNotifications().filter(n => !n.read && (n.forRole === "all" || n.forRole === user?.role)).length;

  const tabs = [
    { to: "/app/home", label: "Home", icon: Home },
    { to: "/app/donations", label: "Activity", icon: Package },
    { to: "/app/notifications", label: "Alerts", icon: Bell, badge: unread },
    { to: "/app/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen gradient-ivory flex flex-col">
      {!hideHeader && (
        <header className="sticky top-0 z-30 bg-card/85 backdrop-blur border-b border-accent/20">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-accent/15 text-maroon"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <AnnaSetuLogo size={30} />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-lg leading-tight text-maroon truncate">{title ?? "AnnaSetu"}</h1>
              {subtitle && <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">{subtitle}</p>}
            </div>
            {!showBack && (
              <button
                onClick={() => navigate("/app/notifications")}
                className="relative p-2 rounded-full hover:bg-accent/15 text-maroon"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-terracotta text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>
      )}

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-28">{children}</main>

      {!hideTabs && user && (
        <nav className="fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur border-t border-accent/25">
          <div className="max-w-md mx-auto px-2 py-2 grid grid-cols-4">
            {tabs.map(t => {
              const active = loc.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <button
                  key={t.to}
                  onClick={() => navigate(t.to)}
                  className={`relative flex flex-col items-center gap-1 py-1.5 rounded-lg transition-smooth ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t.label}</span>
                  {!!t.badge && t.badge > 0 && (
                    <span className="absolute top-0 right-1/4 w-4 h-4 rounded-full bg-terracotta text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                      {t.badge}
                    </span>
                  )}
                  {active && <span className="absolute -bottom-2 w-8 h-0.5 rounded-full bg-accent" />}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
