using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.Common.Response;
using GearVault.Application.DTOs.Appointments;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/appointments")]
public class AppointmentsController(IAppointmentService appointmentService) : ControllerBase
{
    [HttpGet("all")]
    [Documentation("GetAllAppointments", "Retrieve all appointments. Staff and admin only.")]
    public ResponseDto<List<AppointmentDto>> GetAllAppointments()
    {
        var result = appointmentService.GetAllAppointments();
        return new ResponseDto<List<AppointmentDto>>(
            (int)HttpStatusCode.OK,
            "All appointments retrieved successfully.",
            result);
    }

    [HttpGet]
    [Documentation("GetMyAppointments", "Retrieve all appointments for the current user.")]
    public ResponseDto<List<AppointmentDto>> GetMyAppointments()
    {
        var result = appointmentService.GetMyAppointments();
        return new ResponseDto<List<AppointmentDto>>(
            (int)HttpStatusCode.OK,
            "Appointments retrieved successfully.",
            result);
    }

    [HttpGet("{appointmentId:guid}")]
    [Documentation("GetAppointmentById", "Retrieve an appointment by identifier.")]
    public ResponseDto<AppointmentDto> GetAppointmentById([FromRoute] Guid appointmentId)
    {
        var result = appointmentService.GetAppointmentById(appointmentId);
        return new ResponseDto<AppointmentDto>(
            (int)HttpStatusCode.OK,
            "Appointment retrieved successfully.",
            result);
    }

    [HttpPost]
    [Documentation("CreateAppointment", "Create a new appointment for a vehicle owned by the current user.")]
    public ResponseDto<AppointmentDto> CreateAppointment([FromBody] CreateAppointmentDto dto)
    {
        var result = appointmentService.CreateAppointment(dto);
        return new ResponseDto<AppointmentDto>(
            (int)HttpStatusCode.Created,
            "Appointment created successfully.",
            result);
    }

    [HttpPut("{appointmentId:guid}/reschedule")]
    [Documentation("RescheduleAppointment", "Reschedule a pending appointment.")]
    public ResponseDto<AppointmentDto> RescheduleAppointment([FromRoute] Guid appointmentId, [FromBody] RescheduleAppointmentDto dto)
    {
        var result = appointmentService.RescheduleAppointment(appointmentId, dto);
        return new ResponseDto<AppointmentDto>(
            (int)HttpStatusCode.OK,
            "Appointment rescheduled successfully.",
            result);
    }

    [HttpPut("{appointmentId:guid}/cancel")]
    [Documentation("CancelAppointment", "Cancel a pending appointment.")]
    public ResponseDto<AppointmentDto> CancelAppointment([FromRoute] Guid appointmentId)
    {
        var result = appointmentService.CancelAppointment(appointmentId);
        return new ResponseDto<AppointmentDto>(
            (int)HttpStatusCode.OK,
            "Appointment cancelled successfully.",
            result);
    }

    [HttpPost("staff")]
    [Documentation("CreateAppointmentByStaff", "Create an appointment for any customer vehicle. Staff and admin only.")]
    public ResponseDto<AppointmentDto> CreateAppointmentByStaff([FromBody] CreateAppointmentDto dto)
    {
        var result = appointmentService.CreateAppointmentByStaff(dto);
        return new ResponseDto<AppointmentDto>(
            (int)HttpStatusCode.Created,
            "Appointment created successfully.",
            result);
    }

    [HttpPut("{appointmentId:guid}/complete")]
    [Documentation("CompleteAppointment", "Mark an appointment as completed. Staff and admin only.")]
    public ResponseDto<AppointmentDto> CompleteAppointment([FromRoute] Guid appointmentId)
    {
        var result = appointmentService.CompleteAppointment(appointmentId);
        return new ResponseDto<AppointmentDto>(
            (int)HttpStatusCode.OK,
            "Appointment marked as completed.",
            result);
    }
}
