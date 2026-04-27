using Microsoft.AspNetCore.Http;
using VehicleParts.Application.DTOs.Assets;
using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Services;

public interface IFileService: ITransientService
{
    AssetDto UploadDocument(IFormFile file, string uploadedFilePath, string? prefix = null);

    string UploadDocument(string base64Image, string uploadedFilePath, string? prefix = null);

    void DeleteFile(string uploadedFilePath);

    void DeleteFolder(string folderPath);

    string FileExistPath(string uploadedFilePath);
}