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
            limit: 10,
          }),
          [],
        ),
      enabled: debouncedCustomerSearch.length > 0 && !selectedCustomer,
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
    if (!needle) return [];
    return allParts
      .filter(
        (p) =>
          p.isActive &&
          ((p.name ?? "").toLowerCase().includes(needle) ||
            (p.partNumber ?? "").toLowerCase().includes(needle)),
      )
      .slice(0, 5);
  }, [allParts, partSearch]);

  // --- Cart ---
  const [cart, setCart] = useState<CartLine[]>([]);

  const addToCart = (part: PartDto) => {
    if (!part.id) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.part.id === part.id);
      if (existing) {
        return prev.map((c) =>
          c.part.id === part.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { part, quantity: 1 }];
    });
    setPartSearch("");
  };

  const updateQty = (partId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.part.id !== partId));
    } else {
      setCart((prev) =>
        prev.map((c) => (c.part.id === partId ? { ...c, quantity: qty } : c)),
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
              {selectedCustomer?.customer ? (
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">
                      {selectedCustomer.customer.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {selectedCustomer.customer.phoneNumber}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearch("");
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
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
                  {debouncedCustomerSearch.length > 0 &&
                    customerResults.length > 0 && (
                      <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                        {customerResults.map((r) => {
                          const c = r.customer;
                          if (!c?.id) return null;
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                setSelectedCustomer(r);
                                setCustomerSearch("");
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/40"
                            >
                              <div className="font-medium">{c.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {c.phoneNumber}
                                {r.vehicles && r.vehicles.length > 0 && (
                                  <span className="ml-2">
                                    ·{" "}
                                    {r.vehicles
                                      .map((v) => v.vehicleNumber)
                                      .join(", ")}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  {debouncedCustomerSearch.length > 0 &&
                    !searchingCustomers &&
                    customerResults.length === 0 && (
                      <div className="text-xs text-muted-foreground px-1">
                        No customers found.
                      </div>
                    )}
                </>
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
                    <Select
                      value={selectedVehicleId}
                      onValueChange={setSelectedVehicleId}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Choose a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerVehicles.map((v) => (
                          <SelectItem key={v.id} value={v.id ?? ""}>
                            <span className="flex items-center gap-2">
                              <Car className="h-3 w-3" />
                              {v.vehicleNumber} — {v.make} {v.model} ({v.year})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              {partSearch && partResults.length > 0 && (
                <div className="border rounded-md divide-y">
                  {partResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-secondary/40"
                    >
                      <span>
                        <span className="font-medium">{p.name}</span>{" "}
                        <span className="text-xs font-mono text-muted-foreground ml-2">
                          {p.partNumber}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          · stock: {p.stockQuantity}
                        </span>
                      </span>
                      <span className="tabular text-muted-foreground">
                        {formatRs(p.sellingPrice ?? 0)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {partSearch && !loadingParts && partResults.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  No matching parts.
                </div>
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
                  No items yet. Search and add parts above.
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
