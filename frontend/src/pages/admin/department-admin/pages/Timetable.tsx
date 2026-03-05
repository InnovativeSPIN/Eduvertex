import { MainLayout } from "@/pages/admin/department-admin/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/pages/admin/department-admin/components/ui/button";
import { Download, Calendar as CalendarIcon, Clock, Settings, Loader } from "lucide-react";
import { cn } from "@/pages/admin/department-admin/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface ClassSlot {
  subject: string;
  section: string;
  room: string;
  type: "lecture" | "lab" | "tutorial";
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
  const { authToken } = useAuth();
  const [timetableData, setTimetableData] = useState<TimetableData>({});
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState<number[]>([]);
  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartmentTimetable();
  }, []);

  const fetchDepartmentTimetable = async () => {
    try {
      setLoading(true);
      const token = authToken || localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      // Fetch department timetable
      const response = await fetch('/api/v1/department-admin/timetable/department/1', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch timetable: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Group timetable by day and period
        const groupedData: TimetableData = {};
        const periodsSet = new Set<number>();
        
        // If we have timetable data from TimetableSimple (bulk upload)
        if (Array.isArray(result.data)) {
          result.data.forEach((slot: any) => {
            const day = slot.day || slot.day_of_week;
            const period = slot.hour || slot.period_number;
            
            if (!groupedData[day]) {
              groupedData[day] = {};
            }
            
            periodsSet.add(period);
            groupedData[day][period] = {
              subject: slot.subject || slot.subject_name || 'N/A',
              section: slot.section || slot.class || 'N/A',
              room: slot.roomNumber || slot.room_number || 'TBD',
              type: (slot.sessionType || 'lecture').toLowerCase() as "lecture" | "lab" | "tutorial"
            };
          });
        }
        
        setTimetableData(groupedData);
        const sortedPeriods = Array.from(periodsSet).sort((a, b) => a - b);
        setPeriods(sortedPeriods);
        
        // Generate time slots from periods (assuming each period is 1 hour starting at 9 AM)
        const generatedSlots = sortedPeriods.map(p => {
          const hour = 9 + p - 1;
          return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        });
        setTimeSlots(generatedSlots || ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  }

  // Break timings for different years
  const breakTimings = {
    '1st-2nd': [
      { name: 'Morning Break', time: '11:00 AM - 11:15 AM' },
      { name: 'Lunch Break', time: '1:00 PM - 2:00 PM' }
    ],
    '3rd-4th': [
      { name: 'Morning Break', time: '10:30 AM - 10:45 AM' },
      { name: 'Lunch Break', time: '12:30 PM - 1:30 PM' }
    ]
  };

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
        <div className="flex gap-2">
          <Button variant="outline" className="w-fit">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button 
            onClick={() => navigate('/admin/department/timetable-management')}
            className="w-fit bg-blue-600 hover:bg-blue-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Timetable
          </Button>
        </div>
      </motion.div>

      {/* Legend and Break Timings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Legend */}
        <div className="md:col-span-1 space-y-3">
          <h3 className="font-semibold text-sm mb-3">Legend</h3>
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
        </div>

        {/* Break Timings - Years 1-2 */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-sm mb-3">Break Timings (1st-2nd Year)</h3>
          <div className="space-y-2">
            {breakTimings['1st-2nd'].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <div>
                  <p className="font-medium text-xs">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Break Timings - Years 3-4 */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-sm mb-3">Break Timings (3rd-4th Year)</h3>
          <div className="space-y-2">
            {breakTimings['3rd-4th'].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <div>
                  <p className="font-medium text-xs">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.time}</p>
                </div>
              </div>
            ))}
          </div>
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
            <p>No timetable data available. Upload timetable CSV to get started.</p>
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
                {(periods.length > 0 ? periods : [1, 2, 3, 4, 5, 6, 7]).map((period) => {
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
                            typeStyles[slot.type]
                          )}
                        >
                          <p className={cn("font-semibold text-sm", typeColors[slot.type])}>
                            {slot.subject}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {slot.section} {slot.room}
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


