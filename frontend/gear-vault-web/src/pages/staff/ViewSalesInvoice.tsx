import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { Printer, Mail, Loader2, Sparkles } from "lucide-react";
import { formatRs } from "@/lib/format";
import { GearVaultLogo } from "@/components/shared/Logo";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SalesInvoiceService } from "@/api/generated/client";
import { getApiErrorMessage, unwrapApiResult } from "@/api/client";
import { toast } from "sonner";

const ViewSalesInvoice = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const {
    data: inv,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["salesInvoices", id],
    queryFn: async () =>
      unwrapApiResult(
        await SalesInvoiceService.getInvoiceById({ invoiceId: id! }),
        null,
      ),
    enabled: !!id,
  });

  const sendEmailMutation = useMutation({
    mutationFn: () => SalesInvoiceService.sendInvoiceEmail({ invoiceId: id! }),
    onSuccess: () => {
      toast.success("Invoice email queued");
      queryClient.invalidateQueries({ queryKey: ["salesInvoices", id] });
      setEmailDialogOpen(false);
    },
    onError: (e) =>
      toast.error(getApiErrorMessage(e, "Failed to send invoice email")),
  });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Invoice" />
        <div className="p-10 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading invoice...
        </div>
      </div>
    );
  }

  if (error || !inv) {
    return (
      <div>
        <PageHeader title="Invoice" />
        <div className="p-10 text-center text-sm text-destructive">
          Invoice not found.
        </div>
      </div>
    );
  }

  const customerName = inv.customer?.name ?? "Customer";
  const customerEmail = inv.customer?.emailAddress ?? "";
  const items = inv.items ?? [];

  return (
    <div>
      <PageHeader
        title={inv.invoiceNumber ?? "Invoice"}
        description={`Issued to ${customerName}`}
        actions={
          <>
            <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!customerEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  {inv.emailSent ? "Re-send email" : "Email invoice"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Email this invoice?</DialogTitle>
                </DialogHeader>
                <div className="rounded-md border bg-canvas">
                  <div className="bg-deep-navy text-white p-4 flex items-center gap-2">
                    <GearVaultLogo size={24} className="text-white" />
                    <span className="font-bold">Gear Vault</span>
                  </div>
                  <div className="p-5 text-sm">
                    <p>Hi {customerName},</p>
                    <p className="mt-2">
                      Thank you for your purchase at Gear Vault. Your invoice{" "}
                      <span className="font-mono">{inv.invoiceNumber}</span>{" "}
                      total is{" "}
                      <span className="font-bold">
                        {formatRs(inv.totalAmount ?? 0)}
                      </span>
                      .
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Precision parts. Locked-in trust.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Will be sent to{" "}
                  <span className="font-mono">{customerEmail || "—"}</span>
                </p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEmailDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => sendEmailMutation.mutate()}
                    disabled={sendEmailMutation.isPending || !customerEmail}
                  >
                    {sendEmailMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Send email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </>
        }
      />
      <div className="p-6 lg:p-8 max-w-3xl">
        <Card>
          <div className="bg-deep-navy text-white p-6 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-3">
              <GearVaultLogo size={36} className="text-white" />
              <div>
                <div className="font-bold text-lg">Gear Vault</div>
                <div className="text-xs text-white/60">
                  Precision parts. Locked-in trust.
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60">Invoice</div>
              <div className="font-mono font-semibold">{inv.invoiceNumber}</div>
            </div>
          </div>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Bill to</div>
                <div className="font-medium">{customerName}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  {inv.customer?.phoneNumber}
                </div>
                {inv.vehicle && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Vehicle:{" "}
                    <span className="font-mono">
                      {inv.vehicle.vehicleNumber}
                    </span>{" "}
                    ({inv.vehicle.make} {inv.vehicle.model})
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Date</div>
                <div>
                  {inv.createdAt
                    ? new Date(inv.createdAt).toLocaleDateString()
                    : ""}
                </div>
                <div className="mt-2">
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
                </div>
              </div>
            </div>

            <table className="w-full text-sm border-t">
              <thead>
                <tr className="text-left">
                  {["Item", "Qty", "Price", "Subtotal"].map((h) => (
                    <th
                      key={h}
                      className="py-2 text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="py-3">
                      <div>{it.part?.name ?? "—"}</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {it.part?.partNumber}
                      </div>
                    </td>
                    <td className="py-3 tabular">{it.quantity}</td>
                    <td className="py-3 tabular">
                      {formatRs(it.unitPrice ?? 0)}
                    </td>
                    <td className="py-3 tabular font-medium">
                      {formatRs(it.lineTotal ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t pt-4 space-y-1.5 text-sm max-w-xs ml-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular">{formatRs(inv.subTotal ?? 0)}</span>
              </div>
              {(inv.discountAmount ?? 0) > 0 && (
                <>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <Sparkles className="h-3 w-3" />
                    Loyalty discount applied (10%)
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="tabular text-success">
                      −{formatRs(inv.discountAmount ?? 0)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-base border-t pt-2">
                <span className="font-semibold">Total</span>
                <span className="tabular font-bold">
                  {formatRs(inv.totalAmount ?? 0)}
                </span>
              </div>
            </div>

            {inv.remarks && (
              <div className="border-t pt-3 text-xs text-muted-foreground">
                <div className="uppercase tracking-wider mb-1">Remarks</div>
                <div className="text-charcoal">{inv.remarks}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewSalesInvoice;
