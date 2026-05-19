using System.Net;
using Gridforce.Attributes;
using GearVault.API.Controllers.Base;
using GearVault.Application.Common.Response;
using GearVault.Application.DTOs.AdminNotifications;
using GearVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace GearVault.API.Controllers;

public class AdminNotificationsController(IAdminNotificationService adminNotificationService)
    : BaseController<AdminNotificationsController>
{
    [HttpGet("low-stock")]
    [Documentation("GetLowStockNotifications", "Retrieve low-stock admin notifications.")]
    public ResponseDto<List<AdminNotificationDto>> GetLowStockNotifications()
    {
        var result = adminNotificationService.GetLowStockNotifications();

        return new ResponseDto<List<AdminNotificationDto>>(
            (int)HttpStatusCode.OK,
            "Successfully fetched low-stock notifications.",
            result);
    }
}
