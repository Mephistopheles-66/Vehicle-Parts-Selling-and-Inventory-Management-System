import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Search, Loader2 } from "lucide-react";
import { formatRs } from "@/lib/format";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SalesInvoiceService } from "@/api/generated/client";
import { unwrapApiResult } from "@/api/client";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
};

const SalesInvoicesList = () => {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q.trim(), 300);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["salesInvoices", debouncedQ],
    queryFn: () =>
      SalesInvoiceService.getAllInvoices({
        pageNumber: 1,
        pageSize: 50,
        globalSearch: debouncedQ || undefined,
      }),
  });

  const invoices = response?.result ?? [];
  const rowCount = response?.totalCount ?? 0;

  return (
    <div>
      <PageHeader
        title="Sales Invoices"
        description={
          rowCount > 0
            ? `${rowCount} invoice${rowCount === 1 ? "" : "s"} on record`
            : "POS-style billing."
        }
        actions={
          <Button asChild>
            <Link to="/staff/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              New invoice
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
                placeholder="Search by invoice number..."
                className="pl-9 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Loading invoices...
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-destructive">
              Unable to load invoices. Please try again.
            </CardContent>
          </Card>
        ) : invoices.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              {debouncedQ
                ? `No invoices match "${debouncedQ}".`
                : "No invoices yet — create your first one."}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-deep-navy text-white">
                  <tr>
                    {[
                      "Invoice",
                      "Customer",
                      "Vehicle",
                      "Date",
                      "Total",
                      "Status",
                      "",
                    ].map((h) => (
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
                  {invoices.map((inv, idx) => (
                    <tr
                      key={inv.id}
                      className={`border-b hover:bg-secondary/40 ${idx % 2 ? "bg-canvas" : ""}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {inv.customer?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {inv.vehicle?.vehicleNumber ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {inv.createdAt
                          ? new Date(inv.createdAt).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-4 py-3 tabular font-medium">
                        {formatRs(inv.totalAmount ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          variant={
                            inv.paymentStatus === "Paid"
                              ? "success"
                              : inv.paymentStatus === "Overdue"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {inv.paymentStatus}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/staff/invoices/${inv.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalesInvoicesList;
