import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getRecentActivities,
  markActivityAsRead,
} from "../services/activities";

type Activity = {
  id: number;
  title: string;
  description?: string | null;
  type: string;
  created_at?: string | null;
  read_at?: string | null;
  is_read?: boolean;
};

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const ref = useRef<HTMLDivElement | null>(null);

  const unreadCount = activities.filter((activity) => !activity.is_read).length;

  async function loadActivities() {
    try {
      const data = await getRecentActivities();
      setActivities(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRead(activityId: number) {
    const activity = activities.find((item) => item.id === activityId);

    if (!activity || activity.is_read) return;

    setActivities((current) =>
      current.map((item) =>
        item.id === activityId
          ? {
              ...item,
              is_read: true,
              read_at: new Date().toISOString(),
            }
          : item
      )
    );

    try {
      await markActivityAsRead(activityId);
    } catch (error) {
      console.error(error);
      await loadActivities();
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl p-2 transition hover:bg-white/10"
      >
        <Bell size={24} className="text-slate-300" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-[#101c2d] shadow-2xl shadow-black/40">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold text-white">Notificações</h3>

            <p className="mt-1 text-xs text-slate-400">
              {unreadCount > 0
                ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
                : "Todas as notificações foram lidas"}
            </p>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                Nenhuma notificação encontrada.
              </div>
            ) : (
              activities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => handleRead(activity.id)}
                  className={`block w-full border-b border-white/5 px-5 py-4 text-left transition hover:bg-white/[0.03] ${
                    !activity.is_read ? "bg-cyan-500/[0.06]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!activity.is_read && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        )}

                        <h4 className="truncate text-sm font-medium text-white">
                          {activity.title}
                        </h4>
                      </div>

                      {activity.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                          {activity.description}
                        </p>
                      )}
                    </div>

                    <span className="whitespace-nowrap text-[11px] text-slate-500">
                      {activity.created_at
                        ? new Date(activity.created_at).toLocaleDateString(
                            "pt-BR"
                          )
                        : ""}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}