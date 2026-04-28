using System.Text.Json;
using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Common.User;
using GearVault.Application.DTOs.Appointments;
using GearVault.Application.DTOs.Emails;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class AppointmentService(
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService) : IAppointmentService
{
    public List<AppointmentDto> GetMyAppointments()
    {
        var userId = applicationUserService.GetUserId;

        var appointments = genericRepository.Get<Appointment>(
            x => x.CustomerUserId == userId,
            asNoTracking: true,
            includeProperties: "Vehicle").ToList();

        return appointments.ConvertAll(x => x.ToAppointmentDto());
    }

    public AppointmentDto GetAppointmentById(Guid appointmentId)
    {
        var userId = applicationUserService.GetUserId;

        var appointment = genericRepository.GetById<Appointment>(
            appointmentId,
            asNoTracking: true,
            includeProperties: "Vehicle")
            ?? throw new NotFoundException("Appointment not found.");

        if (appointment.CustomerUserId != userId)
            throw new NotFoundException("Appointment not found.");

        return appointment.ToAppointmentDto();
    }

    public AppointmentDto CreateAppointment(CreateAppointmentDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var vehicle = genericRepository.GetById<Vehicle>(dto.VehicleId, asNoTracking: true)
            ?? throw new NotFoundException("Vehicle not found.");

        if (vehicle.OwnerUserId != userId)
            throw new NotFoundException("Vehicle not found.");

        var appointment = new Appointment(dto.VehicleId, userId, dto.ScheduledAt, dto.Notes);
        genericRepository.Insert(appointment);

        var user = genericRepository.GetById<User>(userId, asNoTracking: true)
            ?? throw new NotFoundException("User not found.");

        var emailPayload = new AppointmentConfirmationPayloadDto { AppointmentId = appointment.Id };
        var outbox = new EmailOutbox(
            user.EmailAddress,
            user.Name,
            "Appointment Confirmation",
            EmailProcess.AppointmentConfirmation,
            JsonSerializer.Serialize(emailPayload));
        genericRepository.Insert(outbox);

        return GetAppointmentById(appointment.Id);
    }

    public AppointmentDto RescheduleAppointment(Guid appointmentId, RescheduleAppointmentDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var appointment = genericRepository.GetById<Appointment>(appointmentId)
            ?? throw new NotFoundException("Appointment not found.");

        if (appointment.CustomerUserId != userId)
            throw new NotFoundException("Appointment not found.");

        if (appointment.Status != AppointmentStatus.Pending)
            throw new BadRequestException("Only pending appointments can be rescheduled.");

        appointment.Reschedule(dto.ScheduledAt, dto.Notes);
        genericRepository.Update(appointment);

        return GetAppointmentById(appointmentId);
    }

    public AppointmentDto CancelAppointment(Guid appointmentId)
    {
        var userId = applicationUserService.GetUserId;

        var appointment = genericRepository.GetById<Appointment>(appointmentId)
            ?? throw new NotFoundException("Appointment not found.");

        if (appointment.CustomerUserId != userId)
            throw new NotFoundException("Appointment not found.");

        if (appointment.Status != AppointmentStatus.Pending)
            throw new BadRequestException("Only pending appointments can be cancelled.");

        appointment.Cancel();
        genericRepository.Update(appointment);

        return GetAppointmentById(appointmentId);
    }
}
