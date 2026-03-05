import { MainLayout } from "@/pages/faculty/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/pages/faculty/components/ui/button";
import { Download, Calendar as CalendarIcon, Clock, Loader } from "lucide-react";
import { cn } from "@/pages/faculty/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface ClassSlot {
  subject_name: string;
  class_name?: string;
  room_number: string;
  period_type: "lecture" | "lab" | "tutorial";
}

type TimetableData = {
  [key: string]: {
    [key: number]: ClassSlot | null;
  };
};

const typeStyles = {
  lecture: "bg-primary/10 border-primary/30 hover:bg-primary/20",
  lab: "bg-secondary/10 border-secondary/30 hover:bg-secondary/20",
  tutorial: "bg-warning/10 border-warning/30 hover:bg-warning/20",
};

const typeColors = {
  lecture: "text-primary",
  lab: "text-secondary",
  tutorial: "text-warning",
};

export default function Timetable() {
  const { user, authToken } = useAuth();
  const [timetableData, setTimetableData] = useState<TimetableData>({});
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState<number[]>([]);
  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

  useEffect(() => {
    fetchFacultyTimetable();
  }, [user?.id]);

  const fetchFacultyTimetable = async () => {
    try {
      setLoading(true);
      const token = authToken || localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch('/api/v1/faculty/my-timetable', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch timetable: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        // Group timetable by day and period
        const groupedData: TimetableData = {};
        const periodsSet = new Set<number>();
        
        if (Array.isArray(data)) {
          data.forEach((slot: any) => {
            const day = slot.day_of_week || slot.day;
            const period = slot.period_number || slot.hour;
            
            if (!groupedData[day]) {
              groupedData[day] = {};
            }
            
            periodsSet.add(period);
            groupedData[day][period] = {
              subject_name: slot.subject?.subject_name || slot.subject || 'N/A',
              class_name: slot.class?.name || slot.class || 'N/A',
              room_number: slot.room_number || slot.room || 'TBD',
              period_type: (slot.session_type || 'lecture').toLowerCase() as "lecture" | "lab" | "tutorial"
            };
          });
        }
        
        setTimetableData(groupedData);
        const sortedPeriods = Array.from(periodsSet).sort((a, b) => a - b);
        setPeriods(sortedPeriods);
        
        // Generate time slots from periods (assuming each period is 1 hour starting at 9 AM)
        const slots = sortedPeriods.map(p => {
          const hour = 9 + p - 1;
          return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        });
        setTimeSlots(slots);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="page-header font-serif">Smart Timetable</h1>
          <p className="text-muted-foreground -mt-4">
            Weekly schedule with interactive class slots
          </p>
        </div>
        <Button variant="outline" className="w-fit">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 border border-primary/30" />
          <span className="text-sm text-muted-foreground">Lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary/20 border border-secondary/30" />
          <span className="text-sm text-muted-foreground">Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning/30" />
          <span className="text-sm text-muted-foreground">Tutorial</span>
        </div>
      </motion.div>

      {/* Timetable Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="widget-card overflow-x-auto"
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader className="w-6 h-6 animate-spin mr-2" />
            <p>Loading timetable...</p>
          </div>
        ) : Object.keys(timetableData).length === 0 ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>No timetable data available. Please check back later.</p>
          </div>
        ) : (
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-muted-foreground border-b">
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                Day
              </th>
              {timeSlots.map((time) => (
                <th
                  key={time}
                  className="p-3 text-center text-sm font-semibold text-muted-foreground border-b"
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <motion.tr
                key={day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + dayIndex * 0.05 }}
                className={cn(day === currentDay && "bg-primary/5")}
              >
                <td className={cn(
                  "p-3 text-sm font-medium border-b whitespace-nowrap",
                  day === currentDay ? "text-primary font-bold" : "text-muted-foreground"
                )}>
                  {day}
                </td>
                {periods.map((period, periodIndex) => {
                  const slot = timetableData[day]?.[period];
                  return (
                    <td
                      key={`${day}-${period}`}
                      className="p-2 border-b"
                    >
                      {slot ? (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all",
                            typeStyles[slot.period_type]
                          )}
                        >
                          <p className={cn("font-semibold text-sm", typeColors[slot.period_type])}>
                            {slot.subject_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {slot.class_name} {slot.room_number}
                          </p>
                        </motion.div>
                      ) : (
                        <div className="p-3 rounded-lg bg-muted/30 text-center">
                          <span className="text-xs text-muted-foreground"></span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
        )}
      </motion.div>
    </MainLayout>
  );
}


