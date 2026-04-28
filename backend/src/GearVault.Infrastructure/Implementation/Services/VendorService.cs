using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Vendors;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class VendorService(IGenericRepository genericRepository) : IVendorService
{
    public List<VendorDto> GetAllVendors()
    {
        var vendors = genericRepository.Get<Vendor>(asNoTracking: true).ToList();

        return vendors.ConvertAll(x => x.ToVendorDto());
    }

    public VendorDto GetVendorById(Guid vendorId)
    {
        var vendor = genericRepository.GetById<Vendor>(vendorId, asNoTracking: true)
                     ?? throw new NotFoundException("Vendor not found.");

        return vendor.ToVendorDto();
    }

    public VendorDto CreateVendor(CreateVendorDto dto)
    {
        if (genericRepository.Exists<Vendor>(v => v.Name == dto.Name))
            throw new BadRequestException("A vendor with this name already exists.");

        var vendor = new Vendor(
            dto.Name,
            dto.ContactEmail,
            dto.Phone,
            dto.Address
        );

        vendor.IsActive = dto.IsActive;

        genericRepository.Insert(vendor);

        return vendor.ToVendorDto();
    }

    public VendorDto UpdateVendor(Guid vendorId, UpdateVendorDto dto)
    {
        var vendor = genericRepository.GetById<Vendor>(vendorId)
                     ?? throw new NotFoundException("Vendor not found.");

        if (dto.Name != null && dto.Name != vendor.Name)
        {
            if (genericRepository.Exists<Vendor>(v => v.Name == dto.Name && v.Id != vendorId))
                throw new BadRequestException("A vendor with this name already exists.");
        }

        vendor.Update(
            dto.Name ?? vendor.Name,
            dto.ContactEmail ?? vendor.ContactEmail,
            dto.Phone ?? vendor.Phone,
            dto.Address ?? vendor.Address,
            dto.IsActive ?? vendor.IsActive
        );

        genericRepository.Update(vendor);

        return vendor.ToVendorDto();
    }

    public void DeleteVendor(Guid vendorId)
    {
        var vendor = genericRepository.GetById<Vendor>(vendorId)
                     ?? throw new NotFoundException("Vendor not found.");

        genericRepository.Delete(vendor);
    }
}
