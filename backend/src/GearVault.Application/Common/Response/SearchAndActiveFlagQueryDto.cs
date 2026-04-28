using System.ComponentModel.DataAnnotations;

namespace GearVault.Application.Common.Response;

public class SearchAndActiveFlagQueryDto : IValidatableObject
{
    public string? GlobalSearch { get; set; }

    public bool[]? IsActive { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        return [];
    }
}