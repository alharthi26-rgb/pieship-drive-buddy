import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";
import { CalendarIcon, ArrowUp, ArrowDown, ArrowUpDown, RefreshCw } from "lucide-react";
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
  TableFooter,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cities = [
  { value: "all", label: "All Cities" },
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "dammam", label: "Dammam" },
  { value: "makkah", label: "Makkah" },
];

const summaryCities = ["riyadh", "jeddah", "dammam", "makkah"] as const;
const summaryCityLabels: Record<string, string> = {
  riyadh: "Riyadh",
  jeddah: "Jeddah",
  dammam: "Dammam",
  makkah: "Makkah",
};

const MAX_CAPACITY = 30;

const timeSlotLabels: Record<string, string> = {
  "12:00": "12:00 PM",
  "14:00": "2:00 PM",
  "17:00": "5:00 PM",
};

type SortField = "created_at" | "time_slot" | "booking_date" | "city" | "mobile" | "full_name";
type SortDir = "asc" | "desc";

const getCellColor = (count: number): string => {
  if (count === 0) return "bg-muted/50";
  if (count <= 15) return "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200";
  if (count <= 25) return "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200";
  return "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200";
};

const Admin = () => {
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Existing bookings query for the registrations tab
  const { data: bookings = [], isLoading, isFetching: bookingsFetching, refetch: refetchBookings } = useQuery({
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

  // 10-day summary query
  const today = new Date();
  const startDate = format(today, "yyyy-MM-dd");
  const endDate = format(addDays(today, 9), "yyyy-MM-dd");

  const { data: summaryBookings = [], isLoading: summaryLoading, isFetching: summaryFetching, refetch: refetchSummary } = useQuery({
    queryKey: ["admin-summary", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_date, city")
        .gte("booking_date", startDate)
        .lte("booking_date", endDate);

      if (error) throw error;
      return data;
    },
    refetchInterval: 15000,
  });

  // Build the 10-day date list and summary counts
  const { dates, summaryMap, cityTotals, grandTotal } = useMemo(() => {
    const dates: string[] = [];
    for (let i = 0; i < 10; i++) {
      dates.push(format(addDays(today, i), "yyyy-MM-dd"));
    }

    const summaryMap: Record<string, Record<string, number>> = {};
    for (const d of dates) {
      summaryMap[d] = {};
      for (const c of summaryCities) {
        summaryMap[d][c] = 0;
      }
    }

    for (const b of summaryBookings) {
      if (summaryMap[b.booking_date] && b.city in summaryMap[b.booking_date]) {
        summaryMap[b.booking_date][b.city]++;
      }
    }

    const cityTotals: Record<string, number> = {};
    for (const c of summaryCities) {
      cityTotals[c] = dates.reduce((sum, d) => sum + (summaryMap[d][c] || 0), 0);
    }
    const grandTotal = Object.values(cityTotals).reduce((a, b) => a + b, 0);

    return { dates, summaryMap, cityTotals, grandTotal };
  }, [summaryBookings, startDate]);

  // Registrations tab logic
  const filteredAndSorted = useMemo(() => {
    let result = [...bookings];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.full_name.toLowerCase().includes(q) ||
          b.mobile.includes(q)
      );
    }

    result.sort((a, b) => {
      const valA = a[sortField] ?? "";
      const valB = b[sortField] ?? "";
      const cmp = String(valA).localeCompare(String(valB));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [bookings, searchQuery, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  const clearFilters = () => {
    setCityFilter("all");
    setDateFilter(undefined);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Registrations Dashboard
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { refetchBookings(); refetchSummary(); }}
            disabled={bookingsFetching || summaryFetching}
          >
            <RefreshCw className={cn("h-4 w-4", (bookingsFetching || summaryFetching) && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="registrations">
          <TabsList>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="summary">10-Day Summary</TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <Input
                  placeholder="Search name or mobile…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[220px]"
                />

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
                  Total: {filteredAndSorted.length} registrations
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
                ) : filteredAndSorted.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No registrations found.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>
                          <button
                            className="flex items-center hover:text-foreground transition-colors"
                            onClick={() => toggleSort("full_name")}
                          >
                            Name <SortIcon field="full_name" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center hover:text-foreground transition-colors"
                            onClick={() => toggleSort("mobile")}
                          >
                            Mobile <SortIcon field="mobile" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center hover:text-foreground transition-colors"
                            onClick={() => toggleSort("city")}
                          >
                            City <SortIcon field="city" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center hover:text-foreground transition-colors"
                            onClick={() => toggleSort("booking_date")}
                          >
                            Date <SortIcon field="booking_date" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center hover:text-foreground transition-colors"
                            onClick={() => toggleSort("time_slot")}
                          >
                            Time Slot <SortIcon field="time_slot" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center hover:text-foreground transition-colors"
                            onClick={() => toggleSort("created_at")}
                          >
                            Registered At <SortIcon field="created_at" />
                          </button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSorted.map((b, i) => (
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
          </TabsContent>

          {/* 10-Day Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  10-Day Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summaryLoading ? (
                  <p className="text-muted-foreground text-center py-8">
                    Loading…
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        {summaryCities.map((c) => (
                          <TableHead key={c} className="text-center">
                            {summaryCityLabels[c]}
                          </TableHead>
                        ))}
                        <TableHead className="text-center font-bold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dates.map((date) => {
                        const rowTotal = summaryCities.reduce(
                          (sum, c) => sum + (summaryMap[date][c] || 0),
                          0
                        );
                        return (
                          <TableRow key={date}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {format(new Date(date + "T00:00:00"), "EEE, MMM d")}
                            </TableCell>
                            {summaryCities.map((c) => {
                              const count = summaryMap[date][c] || 0;
                              return (
                                <TableCell
                                  key={c}
                                  className={cn(
                                    "text-center font-mono text-sm",
                                    getCellColor(count)
                                  )}
                                >
                                  {count} / {MAX_CAPACITY}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center font-bold font-mono text-sm">
                              {rowTotal}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell className="font-bold">Total</TableCell>
                        {summaryCities.map((c) => (
                          <TableCell key={c} className="text-center font-bold font-mono text-sm">
                            {cityTotals[c]}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold font-mono text-sm">
                          {grandTotal}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
