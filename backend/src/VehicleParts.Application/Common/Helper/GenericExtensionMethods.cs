using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace VehicleParts.Application.Common.Helper;

public static class GenericExtensionMethods
{
    public static string SetUniqueFileName(this string fileExtension)
    {
        return $"{DateTime.Now:ddMMyyyyHHmmssfff}" + fileExtension;
    }

    public static long ToUnixTimeMilliSeconds(this DateTime dateTime)
    {
        var dateTimeOffset = new DateTimeOffset(dateTime.ToUniversalTime());
        
        return dateTimeOffset.ToUnixTimeMilliseconds();
    }
    
    public static string ToDisplayName(this string name, Type? type = null)
    {
        var fieldName = name;

        if (fieldName != "Id" && fieldName.EndsWith("Id", StringComparison.Ordinal) && type == typeof(Guid))
            fieldName = fieldName[..^2];

        fieldName = fieldName.Replace('_', ' ').Replace('.', ' ');

        fieldName = Regex.Replace(fieldName, "([a-z0-9])([A-Z])", "$1 $2");

        fieldName = Regex.Replace(fieldName, "([A-Z]+)([A-Z][a-z])", "$1 $2");

        fieldName = Regex.Replace(fieldName, @"\s+", " ").Trim();

        return fieldName;
    }

    public static async Task<string> ComputeSha256Async(this Stream stream, CancellationToken cancellationToken)
    {
        using var sha = SHA256.Create();

        var hashBytes = await sha.ComputeHashAsync(stream, cancellationToken);

        stream.Position = 0;

        return Convert.ToHexString(hashBytes);
    }

    public static string ToFileSize(this long bytes)
    {
        string[] sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        double length = bytes;
        var order = 0;

        while (length >= 1024 && order < sizes.Length - 1)
        {
            order++;
            length /= 1024;
        }

        return $"{length:0.##} {sizes[order]}";
    }

    public static string ToContentType(this string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        return extension switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };
    }
}