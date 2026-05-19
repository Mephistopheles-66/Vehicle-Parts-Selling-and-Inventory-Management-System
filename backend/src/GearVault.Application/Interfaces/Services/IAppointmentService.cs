using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.Appointments;

namespace GearVault.Application.Interfaces.Services;

public interface IAppointmentService : ITransientService
{
    List<AppointmentDto> GetMyAppointments();

    List<AppointmentDto> GetAllAppointments();

    AppointmentDto GetAppointmentById(Guid appointmentId);

    AppointmentDto CreateAppointment(CreateAppointmentDto dto);

    AppointmentDto RescheduleAppointment(Guid appointmentId, RescheduleAppointmentDto dto);

    AppointmentDto CancelAppointment(Guid appointmentId);

    AppointmentDto CompleteAppointment(Guid appointmentId);

    AppointmentDto CreateAppointmentByStaff(CreateAppointmentDto dto);
}
