import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  Search,
  Loader2,
  Car,
  User,
  Package,
} from "lucide-react";
import { formatRs } from "@/lib/format";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  UserService,
  PartsService,
  SalesInvoiceService,
} from "@/api/generated/client";
import type {
  CreateSalesInvoiceDto,
  CreateSalesInvoiceItemDto,
  VehicleDto,
  PartDto,
  CustomerSearchResultDto,
} from "@/api/generated/client";
import { getApiErrorMessage, unwrapApiResult } from "@/api/client";

// Inline debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
};

type CartLine = {
  part: PartDto;
  quantity: number;
};

const CreateSalesInvoice = () => {
  const navigate = useNavigate();

  // --- Customer selection ---
  const [customerSearch, setCustomerSearch] = useState("");
  const debouncedCustomerSearch = useDebounce(customerSearch.trim(), 300);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSearchResultDto | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  const { data: customerResults = [], isFetching: searchingCustomers } =
    useQuery({
      queryKey: ["customers", "search", debouncedCustomerSearch],
      queryFn: async () =>
        unwrapApiResult(
          await UserService.searchCustomers({
            q: debouncedCustomerSearch,
            limit: 50,
          }),
          [],
        ),
    });

  // --- Parts selection ---
  const [partSearch, setPartSearch] = useState("");
  const { data: allParts = [], isLoading: loadingParts } = useQuery({
    queryKey: ["parts"],
    queryFn: async () =>
      unwrapApiResult(await PartsService.getAllParts(), [] as PartDto[]),
  });

  const partResults = useMemo(() => {
    const needle = partSearch.trim().toLowerCase();
    return allParts
      .filter(
        (p) =>
          p.isActive &&
          (!needle ||
            (p.name ?? "").toLowerCase().includes(needle) ||
            (p.partNumber ?? "").toLowerCase().includes(needle) ||
            (p.category ?? "").toLowerCase().includes(needle)),
      )
      .slice(0, 50);
  }, [allParts, partSearch]);

  // --- Cart ---
  const [cart, setCart] = useState<CartLine[]>([]);

  const addToCart = (part: PartDto) => {
    if (!part.id) return;
    const stockQuantity = part.stockQuantity ?? 0;
    if (stockQuantity <= 0) {
      toast.error("This part is out of stock");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.part.id === part.id);
      if (existing) {
        if (existing.quantity >= stockQuantity) {
          toast.error(`Only ${stockQuantity} in stock for ${part.name}`);
          return prev;
        }

        return prev.map((c) =>
          c.part.id === part.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { part, quantity: 1 }];
    });
    setPartSearch("");
  };

  const updateQty = (partId: string, qty: number) => {
    if (!Number.isFinite(qty) || qty <= 0) {
      setCart((prev) => prev.filter((c) => c.part.id !== partId));
    } else {
      setCart((prev) =>
        prev.map((c) => {
          if (c.part.id !== partId) return c;

          const stockQuantity = c.part.stockQuantity ?? 0;
          const nextQuantity = Math.min(qty, stockQuantity);

          if (qty > stockQuantity) {
            toast.error(`Only ${stockQuantity} in stock for ${c.part.name}`);
          }

          return { ...c, quantity: nextQuantity };
        }),
      );
    }
  };

  const removeFromCart = (partId: string) =>
    setCart((prev) => prev.filter((c) => c.part.id !== partId));

  // --- Totals ---
  const subtotal = useMemo(
    () => cart.reduce((s, c) => s + (c.part.sellingPrice ?? 0) * c.quantity, 0),
    [cart],
  );
  const loyaltyApplied = subtotal > 5000;
  const discount = loyaltyApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = subtotal - discount;

  // --- Other fields ---
  const [paymentStatus, setPaymentStatus] = useState<
    "Paid" | "Unpaid" | "PartiallyPaid"
  >("Paid");
  const [remarks, setRemarks] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  // --- Submit ---
  const createMutation = useMutation({
    mutationFn: (payload: CreateSalesInvoiceDto) =>
      SalesInvoiceService.createInvoice({ requestBody: payload }),
    onSuccess: (response) => {
      const newInvoiceId = unwrapApiResult(response, "");
      toast.success("Invoice created successfully");
      if (newInvoiceId) navigate(`/staff/invoices/${newInvoiceId}`);
      else navigate("/staff/invoices");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Unable to create invoice")),
  });

  const submit = () => {
    if (!selectedCustomer?.customer?.id) {
      toast.error("Pick a customer first");
      return;
    }
    if (!selectedVehicleId) {
      toast.error("Pick a vehicle for this sale");
      return;
    }
    if (cart.length === 0) {
      toast.error("Add at least one part to the cart");
      return;
    }

    const payload: CreateSalesInvoiceDto = {
      vehicleId: selectedVehicleId,
      paymentStatus,
      remarks: remarks.trim() || null,
      sendEmail,
      items: cart.map<CreateSalesInvoiceItemDto>((c) => ({
        partId: c.part.id,
        quantity: c.quantity,
      })),
    };

    createMutation.mutate(payload);
  };

  // When customer changes, reset vehicle selection
  const customerVehicles: VehicleDto[] = selectedCustomer?.vehicles ?? [];
  useEffect(() => {
    if (customerVehicles.length === 1 && customerVehicles[0].id) {
      setSelectedVehicleId(customerVehicles[0].id);
    } else {
      setSelectedVehicleId("");
    }
  }, [selectedCustomer]);

  return (
    <div>
      <PageHeader
        title="New Sales Invoice"
        description="POS-style billing with automatic loyalty discount."
      />
      <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* CUSTOMER PICKER */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customer by name, phone, or vehicle number..."
                  className="pl-9"
                />
                {searchingCustomers && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </div>

              {customerResults.length > 0 ? (
                <div className="-mx-1 overflow-x-auto pb-2">
                  <div className="mt-1 flex min-w-max gap-3 px-1">
                    {customerResults.map((r) => {
                      const c = r.customer;
                      const isSelected = c?.id === selectedCustomer?.customer?.id;
                      if (!c?.id) return null;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCustomer(r);
                            setCustomerSearch("");
                          }}
                          className={`w-64 shrink-0 rounded-md border p-3 text-left transition shadow-sm hover:border-primary/50 hover:bg-secondary/30 ${
                            isSelected
                              ? "border-primary bg-background shadow-[0_0_0_1px_hsl(var(--primary))]"
                              : "bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate font-medium">
                                {c.name}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {c.emailAddress ?? "No email"}
                              </div>
                            </div>
                            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                          </div>
                          <div className="mt-2 font-mono text-xs text-muted-foreground">
                            {c.phoneNumber ?? "-"}
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Car className="h-3.5 w-3.5" />
                            {(r.vehicles?.length ?? 0) > 0
                              ? `${r.vehicles?.length} vehicle${r.vehicles?.length === 1 ? "" : "s"}`
                              : "No vehicles"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                !searchingCustomers && (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No customers found.
                  </div>
                )
              )}

              {/* Vehicle picker (only shown when a customer is selected) */}
              {selectedCustomer && (
                <div>
                  <Label className="text-xs">Vehicle for this sale *</Label>
                  {customerVehicles.length === 0 ? (
                    <div className="mt-1.5 text-xs text-destructive">
                      This customer has no vehicles on file.
                    </div>
                  ) : (
                    <div className="-mx-1 mt-2 overflow-x-auto pb-2">
                      <div className="mt-1 flex min-w-max gap-2 px-1">
                        {customerVehicles.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVehicleId(v.id ?? "")}
                            className={`w-56 shrink-0 rounded-md border p-3 text-left text-sm transition shadow-sm hover:border-primary/50 hover:bg-secondary/30 ${
                              selectedVehicleId === v.id
                                ? "border-primary bg-background shadow-[0_0_0_1px_hsl(var(--primary))]"
                                : "bg-background"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-medium">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              {v.vehicleNumber}
                            </div>
                            <div className="mt-1 truncate text-xs text-muted-foreground">
                              {v.make} {v.model} ({v.year})
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ADD PARTS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Add parts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={partSearch}
                  onChange={(e) => setPartSearch(e.target.value)}
                  placeholder="Search parts by name or part number..."
                  className="pl-9"
                />
              </div>
              {loadingParts && (
                <div className="text-xs text-muted-foreground">
                  Loading parts catalogue...
                </div>
              )}
              {partResults.length > 0 ? (
                <div className="-mx-1 overflow-x-auto pb-2">
                  <div className="flex min-w-max gap-3 px-1">
                  {partResults.map((p) => {
                    const stockQuantity = p.stockQuantity ?? 0;
                    const cartQuantity =
                      cart.find((line) => line.part.id === p.id)?.quantity ?? 0;
                    const isDisabled =
                      stockQuantity <= 0 || cartQuantity >= stockQuantity;

                    return (
                      <button
                        key={p.id}
                        onClick={() => addToCart(p)}
                        disabled={isDisabled}
                        className={`w-60 shrink-0 rounded-md border bg-background p-3 text-left text-sm transition ${
                          isDisabled
                            ? "cursor-not-allowed opacity-55"
                            : "hover:border-primary/60 hover:bg-secondary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate font-medium">{p.name}</div>
                            <div className="truncate font-mono text-xs text-muted-foreground">
                              {p.partNumber}
                            </div>
                          </div>
                          <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground">
                            {stockQuantity <= 0
                              ? "Out of stock"
                              : cartQuantity > 0
                                ? `Added: ${cartQuantity}/${stockQuantity}`
                                : `Stock: ${stockQuantity}`}
                          </span>
                          <span className="tabular font-semibold">
                            {formatRs(p.sellingPrice ?? 0)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  </div>
                </div>
              ) : (
                !loadingParts && (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No matching parts.
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* CART / LINE ITEMS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Line items ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {cart.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No items yet. Select parts from the horizontal list above.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-canvas border-y">
                    <tr>
                      {["Part", "Qty", "Price", "Subtotal", ""].map((h) => (
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
                    {cart.map((line) => (
                      <tr key={line.part.id} className="border-b">
                        <td className="px-4 py-2">
                          <div className="font-medium">{line.part.name}</div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {line.part.partNumber}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <Input
                            type="number"
                            min="1"
                            max={line.part.stockQuantity ?? undefined}
                            className="w-20 font-mono"
                            value={line.quantity}
                            onChange={(e) =>
                              updateQty(line.part.id!, Number(e.target.value))
                            }
                          />
                        </td>
                        <td className="px-4 py-2 tabular">
                          {formatRs(line.part.sellingPrice ?? 0)}
                        </td>
                        <td className="px-4 py-2 tabular font-medium">
                          {formatRs(
                            (line.part.sellingPrice ?? 0) * line.quantity,
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(line.part.id!)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* REMARKS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Remarks (optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Customer requested urgent service"
              />
            </CardContent>
          </Card>
        </div>

        {/* SUMMARY PANEL */}
        <Card className="h-fit sticky top-20">
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular font-medium">{formatRs(subtotal)}</span>
            </div>
            {loyaltyApplied && (
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-success/10 text-success text-xs font-medium">
                <Sparkles className="h-4 w-4" />
                Loyalty discount unlocked: −10%
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="tabular text-success">
                {discount > 0 ? `−${formatRs(discount)}` : "—"}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="tabular font-bold">{formatRs(total)}</span>
            </div>

            <div className="border-t pt-3 space-y-2">
              <Label className="text-xs">Payment status</Label>
              <Select
                value={paymentStatus}
                onValueChange={(v) =>
                  setPaymentStatus(v as typeof paymentStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid (credit)</SelectItem>
                  <SelectItem value="PartiallyPaid">Partially paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
              <Checkbox
                checked={sendEmail}
                onCheckedChange={(c) => setSendEmail(!!c)}
              />
              Email invoice copy to customer
            </label>

            <Button
              className="w-full mt-2"
              onClick={submit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              <Plus className="h-4 w-4 mr-2" />
              Complete sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSalesInvoice;
