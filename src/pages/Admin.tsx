import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const cities = [
  { value: "all", label: "All Cities" },
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "dammam", label: "Dammam" },
  { value: "makkah", label: "Makkah" },
];

const timeSlotLabels: Record<string, string> = {
  "12:00": "12:00 PM",
  "14:00": "2:00 PM",
  "17:00": "5:00 PM",
};

const Admin = () => {
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings", cityFilter, dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (cityFilter !== "all") {
        query = query.eq("city", cityFilter);
      }

      if (dateFilter) {
        query = query.eq("booking_date", format(dateFilter, "yyyy-MM-dd"));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000,
  });

  const clearFilters = () => {
    setCityFilter("all");
    setDateFilter(undefined);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          Registrations Dashboard
        </h1>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Button variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>

            <span className="ml-auto text-sm text-muted-foreground font-medium">
              Total: {bookings.length} registrations
            </span>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">
                Loading…
              </p>
            ) : bookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No registrations found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Registered At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b, i) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {b.full_name}
                      </TableCell>
                      <TableCell dir="ltr">{b.mobile}</TableCell>
                      <TableCell className="capitalize">{b.city}</TableCell>
                      <TableCell>{b.booking_date}</TableCell>
                      <TableCell>
                        {timeSlotLabels[b.time_slot] ?? b.time_slot}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {format(new Date(b.created_at), "yyyy-MM-dd HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
