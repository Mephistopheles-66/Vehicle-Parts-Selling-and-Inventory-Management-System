using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Common.User;
using GearVault.Application.DTOs.Vehicles;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class VehicleService(
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService) : IVehicleService
{
    public List<VehicleDto> GetMyVehicles()
    {
        var userId = applicationUserService.GetUserId;

        var vehicles = genericRepository.Get<Vehicle>(
            x => x.OwnerUserId == userId,
            asNoTracking: true).ToList();

        return vehicles.ConvertAll(x => x.ToVehicleDto());
    }

    public VehicleDto GetVehicleById(Guid vehicleId)
    {
        var userId = applicationUserService.GetUserId;

        var vehicle = genericRepository.GetById<Vehicle>(vehicleId, asNoTracking: true)
                      ?? throw new NotFoundException("Vehicle not found.");

        if (vehicle.OwnerUserId != userId)
            throw new NotFoundException("Vehicle not found.");

        return vehicle.ToVehicleDto();
    }

    public VehicleDto CreateVehicle(CreateVehicleDto dto)
    {
        var userId = applicationUserService.GetUserId;

        if (genericRepository.Exists<Vehicle>(v => v.PlateNumber == dto.PlateNumber))
            throw new BadRequestException("A vehicle with this plate number already exists.");

        if (dto.Vin != null && genericRepository.Exists<Vehicle>(v => v.Vin == dto.Vin))
            throw new BadRequestException("A vehicle with this VIN already exists.");

        var fuelType = ParseFuelType(dto.FuelType);

        var vehicle = new Vehicle(
            userId,
            dto.PlateNumber,
            dto.Make,
            dto.Model,
            dto.Year,
            dto.Vin,
            dto.Mileage,
            fuelType,
            dto.RegistrationDate
        );

        vehicle.IsActive = dto.IsActive;

        genericRepository.Insert(vehicle);

        return vehicle.ToVehicleDto();
    }

    public VehicleDto UpdateVehicle(Guid vehicleId, UpdateVehicleDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var vehicle = genericRepository.GetById<Vehicle>(vehicleId)
                      ?? throw new NotFoundException("Vehicle not found.");

        if (vehicle.OwnerUserId != userId)
            throw new NotFoundException("Vehicle not found.");

        if (dto.PlateNumber != null && dto.PlateNumber != vehicle.PlateNumber)
        {
            if (genericRepository.Exists<Vehicle>(v => v.PlateNumber == dto.PlateNumber && v.Id != vehicleId))
                throw new BadRequestException("A vehicle with this plate number already exists.");
        }

        if (dto.Vin != null && dto.Vin != vehicle.Vin)
        {
            if (genericRepository.Exists<Vehicle>(v => v.Vin == dto.Vin && v.Id != vehicleId))
                throw new BadRequestException("A vehicle with this VIN already exists.");
        }

        var fuelType = dto.FuelType != null ? ParseFuelType(dto.FuelType) : vehicle.FuelType;

        vehicle.Update(
            dto.PlateNumber ?? vehicle.PlateNumber,
            dto.Make ?? vehicle.Make,
            dto.Model ?? vehicle.Model,
            dto.Year ?? vehicle.Year,
            dto.Vin ?? vehicle.Vin,
            dto.Mileage ?? vehicle.Mileage,
            fuelType,
            dto.RegistrationDate ?? vehicle.RegistrationDate,
            dto.IsActive ?? vehicle.IsActive
        );

        genericRepository.Update(vehicle);

        return vehicle.ToVehicleDto();
    }

    public void DeleteVehicle(Guid vehicleId)
    {
        var userId = applicationUserService.GetUserId;

        var vehicle = genericRepository.GetById<Vehicle>(vehicleId)
                      ?? throw new NotFoundException("Vehicle not found.");

        if (vehicle.OwnerUserId != userId)
            throw new NotFoundException("Vehicle not found.");

        genericRepository.Delete(vehicle);
    }

    private static FuelType ParseFuelType(string fuelType)
    {
        return fuelType.ToUpper() switch
        {
            "PETROL" => FuelType.Petrol,
            "DIESEL" => FuelType.Diesel,
            "ELECTRIC" => FuelType.Electric,
            "HYBRID" => FuelType.Hybrid,
            "CNG" => FuelType.CNG,
            "LPG" => FuelType.LPG,
            _ => throw new BadRequestException($"Invalid fuel type: {fuelType}")
        };
    }
}
