using GearVault.Domain.Entities;
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
            x => x.UserId == userId,
            asNoTracking: true,
            includeProperties: "User").ToList();

        return vehicles.ConvertAll(x => x.ToVehicleDto());
    }

    public VehicleDto GetVehicleById(Guid vehicleId)
    {
        var userId = applicationUserService.GetUserId;

        var vehicle = genericRepository.GetById<Vehicle>(vehicleId, asNoTracking: true, includeProperties: "User")
                      ?? throw new NotFoundException("Vehicle not found.");

        if (vehicle.UserId != userId)
            throw new NotFoundException("Vehicle not found.");

        return vehicle.ToVehicleDto();
    }

    public List<VehicleDto> GetVehiclesByCustomerId(Guid customerId)
    {
        var customer = genericRepository.GetById<User>(customerId)
            ?? throw new NotFoundException("Customer not found.");

        var vehicles = genericRepository.Get<Vehicle>(
            v => v.UserId == customerId,
            asNoTracking: true,
            includeProperties: "User"
        ).ToList();

        return vehicles.ConvertAll(v => v.ToVehicleDto(customer));
    }

    public VehicleDto CreateVehicle(CreateVehicleDto dto)
    {
        var userId = applicationUserService.GetUserId;

        if (genericRepository.Exists<Vehicle>(v => v.VehicleNumber == dto.VehicleNumber))
            throw new BadRequestException("A vehicle with this vehicle number already exists.");

        if (genericRepository.Exists<Vehicle>(v => v.LicenseNumber == dto.LicenseNumber))
            throw new BadRequestException("A vehicle with this license number already exists.");

        var vehicle = new Vehicle(
            userId,
            dto.VehicleNumber,
            dto.LicenseNumber,
            dto.Make,
            dto.Model,
            dto.Year,
            dto.FuelType
        );

        genericRepository.Insert(vehicle);

        return vehicle.ToVehicleDto();
    }

    public VehicleDto UpdateVehicle(Guid vehicleId, UpdateVehicleDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var vehicle = genericRepository.GetById<Vehicle>(vehicleId, includeProperties: "User")
                      ?? throw new NotFoundException("Vehicle not found.");

        if (vehicle.UserId != userId)
            throw new NotFoundException("Vehicle not found.");

        if (dto.VehicleNumber != null && dto.VehicleNumber != vehicle.VehicleNumber)
        {
            if (genericRepository.Exists<Vehicle>(v => v.VehicleNumber == dto.VehicleNumber && v.Id != vehicleId))
                throw new BadRequestException("A vehicle with this vehicle number already exists.");
        }

        if (dto.LicenseNumber != null && dto.LicenseNumber != vehicle.LicenseNumber)
        {
            if (genericRepository.Exists<Vehicle>(v => v.LicenseNumber == dto.LicenseNumber && v.Id != vehicleId))
                throw new BadRequestException("A vehicle with this license number already exists.");
        }

        vehicle.Update(
            dto.VehicleNumber ?? vehicle.VehicleNumber,
            dto.LicenseNumber ?? vehicle.LicenseNumber,
            dto.Make ?? vehicle.Make,
            dto.Model ?? vehicle.Model,
            dto.Year ?? vehicle.Year,
            dto.FuelType ?? vehicle.FuelType
        );

        genericRepository.Update(vehicle);

        return vehicle.ToVehicleDto();
    }

    public void DeleteVehicle(Guid vehicleId)
    {
        var userId = applicationUserService.GetUserId;

        var vehicle = genericRepository.GetById<Vehicle>(vehicleId)
                      ?? throw new NotFoundException("Vehicle not found.");

        if (vehicle.UserId != userId)
            throw new NotFoundException("Vehicle not found.");

        genericRepository.Delete(vehicle);
    }
}
