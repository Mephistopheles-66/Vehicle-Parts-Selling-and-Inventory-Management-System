using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class Vehicle(
    Guid userId,
    string vehicleNumber,
    string licenseNumber,
    string make,
    string model,
    int year,
    FuelType fuelType
) : AuditableEntity<Guid>
{
    [ForeignKey(nameof(User))]
    public Guid UserId { get; private set; } = userId;

    public string VehicleNumber { get; private set; } = vehicleNumber;

    public string LicenseNumber { get; private set; } = licenseNumber;

    public string Make { get; private set; } = make;

    public string Model { get; private set; } = model;

    public int Year { get; private set; } = year;

    public FuelType FuelType { get; private set; } = fuelType;

    public virtual User? User { get; set; }

    public virtual ICollection<SalesInvoice>? SalesInvoices { get; set; }

    public virtual ICollection<ServiceAppointment>? ServiceAppointments { get; set; }

    public virtual ICollection<UnavailablePartRequest>? UnavailablePartRequests { get; set; }

    public virtual ICollection<ServiceRecord>? ServiceRecords { get; set; }

    public virtual ICollection<PartFailurePrediction>? PartFailurePredictions { get; set; }

    public void Update(string vehicleNumber, string licenseNumber, string make, string model, int year, FuelType fuelType)
    {
        if (VehicleNumber != vehicleNumber) VehicleNumber = vehicleNumber;
        if (LicenseNumber != licenseNumber) LicenseNumber = licenseNumber;
        if (Make != make) Make = make;
        if (Model != model) Model = model;
        if (Year != year) Year = year;
        if (FuelType != fuelType) FuelType = fuelType;
    }
}
