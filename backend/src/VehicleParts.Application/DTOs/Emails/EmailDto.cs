using VehicleParts.Domain.Common.Enum;

namespace VehicleParts.Application.DTOs.Emails;

public class EmailDto
{
    #region Required Fields
    public string FullName { get; set; } = string.Empty;
    
    public string ToEmailAddress { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public EmailProcess Process { get; set; }

    public string Remarks { get; set; } = string.Empty;
    #endregion

    #region Calculated Fields
    public string Body { get; set; } = string.Empty;

    public List<KeyValuePair<string, string>> PlaceHolders { get; set; } = [];
    #endregion

    #region Attachment Files
    public string? FileUrl { get; set; }

    public string? FileName { get; set; }
    #endregion

    #region Optional Fields
    public string? Cc { get; set; }
    #endregion

    #region Registration Fields
    public string? Name { get; set; }

    public string? Username { get; set; }

    public string? EmailAddress { get; set; }

    public string? Password { get; set; }

    public string? VerificationCode { get; set; }
    #endregion
}