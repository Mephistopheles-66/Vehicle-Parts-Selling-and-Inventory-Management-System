import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api/generated/client";
import { unwrapApiResult } from "@/api/client";
import { StatusBadge } from "@/components/shared/StatusBadge";

// Tiny inline debounce hook — delays a value by N ms.
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
};

const CustomersList = () => {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q.trim(), 300);

  const {
    data: results = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["customers", "search", debouncedQ],
    queryFn: async () =>
      unwrapApiResult(
        await UserService.searchCustomers({ q: debouncedQ, limit: 50 }),
        [],
      ),
    enabled: debouncedQ.length > 0,
  });

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Search by name, phone, customer ID, or vehicle number."
        actions={
          <Button asChild>
            <Link to="/staff/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Register customer
            </Link>
          </Button>
        }
      />
      <div className="p-6 lg:p-8 space-y-5">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, phone, ID, or vehicle plate (e.g. BA-1-CHA-1234)..."
                className="pl-9 h-11"
                autoFocus
              />
              {isFetching && debouncedQ.length > 0 && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tip: searches across customer name, phone, ID, and any of their
              vehicle numbers.
            </div>
          </CardContent>
        </Card>

        {debouncedQ.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              Start typing to search for customers.
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Searching...
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-destructive">
              Unable to load customers. Please try again.
            </CardContent>
          </Card>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No customers found for "{debouncedQ}".
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-deep-navy text-white">
                  <tr>
                    {["Customer", "Phone", "Email", "Vehicles", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const c = r.customer;
                    const vehicles = r.vehicles ?? [];
                    if (!c?.id) return null;
                    return (
                      <tr
                        key={c.id}
                        className={`border-b hover:bg-secondary/40 ${i % 2 ? "bg-canvas" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            to={`/staff/customers/${c.id}`}
                            className="font-medium text-charcoal hover:text-primary"
                          >
                            {c.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {c.phoneNumber}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {c.emailAddress || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {vehicles.length === 0 ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {vehicles.slice(0, 3).map((v) => (
                                <span
                                  key={v.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-xs font-mono"
                                >
                                  <Car className="h-3 w-3" />
                                  {v.vehicleNumber}
                                </span>
                              ))}
                              {vehicles.length > 3 && (
                                <StatusBadge variant="info">
                                  +{vehicles.length - 3} more
                                </StatusBadge>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/staff/customers/${c.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomersList;
