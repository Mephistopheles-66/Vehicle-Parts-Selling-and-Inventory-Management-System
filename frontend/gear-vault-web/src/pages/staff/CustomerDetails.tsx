import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api/generated/client";
import { unwrapApiResult } from "@/api/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRs } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Car, Loader2, FileText, Plus } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

const CustomerDetails = () => {
  const { id } = useParams();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers", id, "full-profile"],
    queryFn: async () =>
      unwrapApiResult(
        await UserService.getCustomerFullProfile({
          customerId: id!,
          recentInvoiceLimit: 20,
        }),
        null,
      ),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Customer" />
        <div className="p-10 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading customer profile...
        </div>
      </div>
    );
  }

  if (error || !profile?.customer) {
    return (
      <div>
        <PageHeader title="Customer" />
        <div className="p-10 text-center text-sm text-destructive">
          Customer not found.
        </div>
      </div>
    );
  }

  const c = profile.customer;
  const vehicles = profile.vehicles ?? [];
  const invoices = profile.recentInvoices ?? [];
  const totalInvoices = profile.totalInvoiceCount ?? 0;
  const lifetimeSpend = profile.lifetimeSpend ?? 0;
  const outstandingBalance = profile.outstandingBalance ?? 0;

  return (
    <div>
      <PageHeader
        title={c.name ?? "Customer"}
        description={c.phoneNumber ?? ""}
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
        {/* KPI cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">
                Lifetime spent
              </div>
              <div className="text-2xl font-bold tabular text-charcoal mt-1">
                {formatRs(lifetimeSpend)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">
                Total invoices
              </div>
              <div className="text-2xl font-bold tabular text-primary mt-1">
                {totalInvoices}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">
                Outstanding balance
              </div>
              <div
                className={`text-2xl font-bold tabular mt-1 ${outstandingBalance > 0 ? "text-destructive" : "text-charcoal"}`}
              >
                {formatRs(outstandingBalance)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vehicles">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vehicles">
              Vehicles ({vehicles.length})
            </TabsTrigger>
            <TabsTrigger value="purchases">
              Purchases ({invoices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-5">
            <Card>
              <CardContent className="p-6 space-y-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Full name</div>
                  <div className="font-medium">{c.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div>{c.emailAddress || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="font-mono">{c.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Address</div>
                  <div>{c.address || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Username</div>
                  <div className="font-mono text-xs">{c.username}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="mt-5">
            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-muted-foreground">
                  No vehicles on file.
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <Card key={v.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <Car className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">
                            {v.make} {v.model}{" "}
                            <span className="text-muted-foreground font-normal">
                              {v.year}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-muted-foreground mt-0.5">
                            {v.vehicleNumber}
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">
                                License{" "}
                              </span>
                              <span className="text-charcoal font-mono">
                                {v.licenseNumber || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Fuel{" "}
                              </span>
                              <span className="text-charcoal">
                                {v.fuelType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchases" className="mt-5">
            {invoices.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-muted-foreground">
                  No purchases yet.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-canvas border-y">
                      <tr>
                        {[
                          "Invoice",
                          "Date",
                          "Subtotal",
                          "Discount",
                          "Total",
                          "Status",
                          "",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="border-b last:border-0 hover:bg-secondary/40"
                        >
                          <td className="px-4 py-3 font-mono text-xs">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {inv.createdAt
                              ? new Date(inv.createdAt).toLocaleDateString()
                              : ""}
                          </td>
                          <td className="px-4 py-3 tabular">
                            {formatRs(inv.subTotal ?? 0)}
                          </td>
                          <td className="px-4 py-3 tabular text-success">
                            {(inv.discountAmount ?? 0) > 0
                              ? `−${formatRs(inv.discountAmount!)}`
                              : "—"}
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
                              <Link to={`/staff/invoices/${inv.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDetails;
