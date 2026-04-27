namespace VehicleParts.Application.DTOs.Base;

public class BaseDto
{
    public Guid Id { get; set; }

    public bool IsActive { get; set; } = true;
}