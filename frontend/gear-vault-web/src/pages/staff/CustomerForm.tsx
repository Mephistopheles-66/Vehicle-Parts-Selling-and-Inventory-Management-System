import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, Loader2, Plus, Trash2, Car } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/api/generated/client";
import type {
  RegisterWalkInCustomerDto,
  CreateWalkInVehicleDto,
} from "@/api/generated/client";
import { getApiErrorMessage, unwrapApiResult } from "@/api/client";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];

type CustomerFormState = {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
};

type VehicleFormState = {
  vehicleNumber: string;
  licenseNumber: string;
  make: string;
  model: string;
  year: string;
  fuelType: string;
};

const emptyCustomer: CustomerFormState = {
  name: "",
  phoneNumber: "",
  emailAddress: "",
  address: "",
};

const emptyVehicle: VehicleFormState = {
  vehicleNumber: "",
  licenseNumber: "",
  make: "",
  model: "",
  year: "",
  fuelType: "Petrol",
};

const CustomerForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1>(0);
  const [customer, setCustomer] = useState<CustomerFormState>(emptyCustomer);
  const [vehicles, setVehicles] = useState<VehicleFormState[]>([
    { ...emptyVehicle },
  ]);

  const setCustomerField = (key: keyof CustomerFormState, value: string) =>
    setCustomer((prev) => ({ ...prev, [key]: value }));

  const setVehicleField = (
    index: number,
    key: keyof VehicleFormState,
    value: string,
  ) =>
    setVehicles((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    );

  const addVehicle = () =>
    setVehicles((prev) => [...prev, { ...emptyVehicle }]);
  const removeVehicle = (index: number) =>
    setVehicles((prev) => prev.filter((_, i) => i !== index));

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterWalkInCustomerDto) =>
      UserService.registerWalkInCustomer({ requestBody: payload }),
    onSuccess: (response) => {
      const customerId = unwrapApiResult(response, "");
      toast.success("Customer registered successfully");
      if (customerId) navigate(`/staff/customers/${customerId}`);
      else navigate("/staff/customers");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Unable to register customer")),
  });

  const validateCustomer = (): boolean => {
    if (!customer.name.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!customer.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!customer.emailAddress.trim() || !customer.emailAddress.includes("@")) {
      toast.error("A valid email address is required");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCustomer()) setStep(1);
  };

  const submit = () => {
    if (!validateCustomer()) {
      setStep(0);
      return;
    }

    const validVehicles = vehicles.filter(
      (v) => v.vehicleNumber.trim().length > 0,
    );
    if (validVehicles.length === 0) {
      toast.error("Add at least one vehicle");
      return;
    }

    for (const v of validVehicles) {
      if (!v.make.trim() || !v.model.trim() || !v.year.trim()) {
        toast.error("All vehicles need make, model, and year");
        return;
      }
    }

    const payload: RegisterWalkInCustomerDto = {
      name: customer.name.trim(),
      phoneNumber: customer.phoneNumber.trim(),
      emailAddress: customer.emailAddress.trim(),
      address: customer.address.trim() || null,
      vehicles: validVehicles.map<CreateWalkInVehicleDto>((v) => ({
        vehicleNumber: v.vehicleNumber.trim(),
        licenseNumber: v.licenseNumber.trim(),
        make: v.make.trim(),
        model: v.model.trim(),
        year: Number(v.year),
        fuelType: v.fuelType as CreateWalkInVehicleDto["fuelType"],
      })),
    };

    registerMutation.mutate(payload);
  };

  return (
    <div>
      <PageHeader
        title="Register Customer"
        description="Walk-in customer with vehicle details"
      />
      <div className="p-6 lg:p-8 max-w-3xl space-y-5">
        <div className="flex gap-2">
          {["Customer info", "Vehicle details"].map((s, i) => (
            <div
              key={s}
              className={`flex-1 p-3 rounded-md border ${step >= i ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}
            >
              <div className="text-[10px] uppercase tracking-wider">
                Step {i + 1}
              </div>
              <div className="text-sm font-medium">{s}</div>
            </div>
          ))}
        </div>

        {step === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full name *</Label>
                  <Input
                    className="mt-1.5"
                    value={customer.name}
                    onChange={(e) => setCustomerField("name", e.target.value)}
                    placeholder="Aaryan Jha"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    className="mt-1.5 font-mono"
                    value={customer.phoneNumber}
                    onChange={(e) =>
                      setCustomerField("phoneNumber", e.target.value)
                    }
                    placeholder="9841000111"
                  />
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  className="mt-1.5"
                  value={customer.emailAddress}
                  onChange={(e) =>
                    setCustomerField("emailAddress", e.target.value)
                  }
                  placeholder="aaryan@example.com"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  className="mt-1.5"
                  value={customer.address}
                  onChange={(e) => setCustomerField("address", e.target.value)}
                  placeholder="Kathmandu"
                />
              </div>
              <Button onClick={nextStep} className="w-full">
                Next: Vehicle details <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Vehicle details</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVehicle}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add another vehicle
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {vehicles.map((v, idx) => (
                <div key={idx} className="rounded-md border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Car className="h-4 w-4 text-primary" />
                      Vehicle {idx + 1}
                    </div>
                    {vehicles.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVehicle(idx)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vehicle number *</Label>
                      <Input
                        className="mt-1.5 font-mono"
                        value={v.vehicleNumber}
                        onChange={(e) =>
                          setVehicleField(idx, "vehicleNumber", e.target.value)
                        }
                        placeholder="BA-1-CHA-1234"
                      />
                    </div>
                    <div>
                      <Label>License number</Label>
                      <Input
                        className="mt-1.5 font-mono"
                        value={v.licenseNumber}
                        onChange={(e) =>
                          setVehicleField(idx, "licenseNumber", e.target.value)
                        }
                        placeholder="LIC-001"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Make *</Label>
                      <Input
                        className="mt-1.5"
                        value={v.make}
                        onChange={(e) =>
                          setVehicleField(idx, "make", e.target.value)
                        }
                        placeholder="Toyota"
                      />
                    </div>
                    <div>
                      <Label>Model *</Label>
                      <Input
                        className="mt-1.5"
                        value={v.model}
                        onChange={(e) =>
                          setVehicleField(idx, "model", e.target.value)
                        }
                        placeholder="Hilux"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Year *</Label>
                      <Input
                        type="number"
                        className="mt-1.5 font-mono"
                        value={v.year}
                        onChange={(e) =>
                          setVehicleField(idx, "year", e.target.value)
                        }
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <Label>Fuel type</Label>
                      <Select
                        value={v.fuelType}
                        onValueChange={(value) =>
                          setVehicleField(idx, "fuelType", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fuelTypes.map((ft) => (
                            <SelectItem key={ft} value={ft}>
                              {ft}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(0)}
                  disabled={registerMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={submit}
                  className="flex-1"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save customer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerForm;
