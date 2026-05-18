using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.DTOs.Parts;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class PartService(IGenericRepository genericRepository) : IPartService
{
    public List<PartDto> GetAllParts()
    {
        var parts = genericRepository.Get<Part>(asNoTracking: true).ToList();

        return parts.ConvertAll(x => x.ToPartDto());
    }

    public PartDto GetPartById(Guid partId)
    {
        var part = genericRepository.GetById<Part>(partId, asNoTracking: true)
                   ?? throw new NotFoundException("Part not found.");

        return part.ToPartDto();
    }

    public PartDto CreatePart(CreatePartDto dto)
    {
        if (genericRepository.Exists<Part>(p => p.PartNumber == dto.PartNumber))
            throw new BadRequestException("A part with this part number already exists.");

        var unit = ParseUnit(dto.Unit);

        var part = new Part(
            dto.PartNumber,
            dto.Name,
            dto.Description,
            dto.Category,
            unit,
            dto.StockQuantity,
            dto.ReorderLevel,
            dto.SellingPrice
        );

        part.IsActive = dto.IsActive;

        genericRepository.Insert(part);

        return part.ToPartDto();
    }

    public PartDto UpdatePart(Guid partId, UpdatePartDto dto)
    {
        var part = genericRepository.GetById<Part>(partId)
                   ?? throw new NotFoundException("Part not found.");

        if (dto.PartNumber != null && dto.PartNumber != part.PartNumber)
        {
            if (genericRepository.Exists<Part>(p => p.PartNumber == dto.PartNumber && p.Id != partId))
                throw new BadRequestException("A part with this part number already exists.");
        }

        var unit = dto.Unit != null ? ParseUnit(dto.Unit) : part.Unit;

        part.Update(
            dto.PartNumber ?? part.PartNumber,
            dto.Name ?? part.Name,
            dto.Description ?? part.Description,
            dto.Category ?? part.Category,
            unit,
            dto.StockQuantity ?? part.StockQuantity,
            dto.ReorderLevel ?? part.ReorderLevel,
            dto.SellingPrice ?? part.SellingPrice,
            dto.IsActive ?? part.IsActive
        );

        genericRepository.Update(part);

        return part.ToPartDto();
    }

    public void DeletePart(Guid partId)
    {
        var part = genericRepository.GetById<Part>(partId)
                   ?? throw new NotFoundException("Part not found.");

        genericRepository.Delete(part);
    }

    private static UnitType ParseUnit(string unit)
    {
        return unit.ToUpper() switch
        {
            "PIECE" => UnitType.Piece,
            "BOX" => UnitType.Box,
            "METER" => UnitType.Meter,
            "LITER" => UnitType.Liter,
            "KG" => UnitType.Kg,
            _ => throw new BadRequestException($"Invalid unit type: {unit}")
        };
    }
}
