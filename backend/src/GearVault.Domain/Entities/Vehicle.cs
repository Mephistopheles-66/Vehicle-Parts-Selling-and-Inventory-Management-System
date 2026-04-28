using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class Vehicle(
    Guid ownerUserId,
    string plateNumber,
    string make,
    string model,
    int year,
    string? vin,
    int mileage,
    FuelType fuelType,
    DateTime registrationDate
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(Owner))]
    public Guid OwnerUserId { get; private set; } = ownerUserId;

    public string PlateNumber { get; private set; } = plateNumber;

    public string Make { get; private set; } = make;

    public string Model { get; private set; } = model;

    public int Year { get; private set; } = year;

    public string? Vin { get; private set; } = vin;

    public int Mileage { get; private set; } = mileage;

    public FuelType FuelType { get; private set; } = fuelType;

    public DateTime RegistrationDate { get; private set; } = registrationDate;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual User? Owner { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public void Update(
        string plateNumber,
        string make,
        string model,
        int year,
        string? vin,
        int mileage,
        FuelType fuelType,
        DateTime registrationDate,
        bool isActive)
    {
        PlateNumber = plateNumber;
        Make = make;
        Model = model;
        Year = year;
        Vin = vin;
        Mileage = mileage;
        FuelType = fuelType;
        RegistrationDate = registrationDate;
        IsActive = isActive;
        UpdatedAt = DateTime.Now;
    }
}
