using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.DTOs.Appointments;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/appointments")]
public class AppointmentsController(IAppointmentService appointmentService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetMyAppointments", "Retrieve all appointments for the current user.")]
    public ActionResult<List<AppointmentDto>> GetMyAppointments()
    {
        var result = appointmentService.GetMyAppointments();
        return Ok(result);
    }

    [HttpGet("{appointmentId:guid}")]
    [Documentation("GetAppointmentById", "Retrieve an appointment by identifier.")]
    public ActionResult<AppointmentDto> GetAppointmentById([FromRoute] Guid appointmentId)
    {
        var result = appointmentService.GetAppointmentById(appointmentId);
        return Ok(result);
    }

    [HttpPost]
    [Documentation("CreateAppointment", "Create a new appointment for a vehicle owned by the current user.")]
    public ActionResult<AppointmentDto> CreateAppointment([FromBody] CreateAppointmentDto dto)
    {
        var result = appointmentService.CreateAppointment(dto);
        return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPut("{appointmentId:guid}/reschedule")]
    [Documentation("RescheduleAppointment", "Reschedule a pending appointment.")]
    public ActionResult<AppointmentDto> RescheduleAppointment([FromRoute] Guid appointmentId, [FromBody] RescheduleAppointmentDto dto)
    {
        var result = appointmentService.RescheduleAppointment(appointmentId, dto);
        return Ok(result);
    }

    [HttpPut("{appointmentId:guid}/cancel")]
    [Documentation("CancelAppointment", "Cancel a pending appointment.")]
    public ActionResult<AppointmentDto> CancelAppointment([FromRoute] Guid appointmentId)
    {
        var result = appointmentService.CancelAppointment(appointmentId);
        return Ok(result);
    }
}
