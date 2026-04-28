using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Common.User;
using GearVault.Application.DTOs.Reviews;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class ReviewService(
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService) : IReviewService
{
    public List<ReviewDto> GetMyReviews()
    {
        var userId = applicationUserService.GetUserId;

        var reviews = genericRepository.Get<Review>(
            x => x.CustomerUserId == userId,
            asNoTracking: true).ToList();

        return reviews.ConvertAll(x => x.ToReviewDto());
    }

    public ReviewDto GetReviewById(Guid reviewId)
    {
        var userId = applicationUserService.GetUserId;

        var review = genericRepository.GetById<Review>(reviewId, asNoTracking: true)
            ?? throw new NotFoundException("Review not found.");

        if (review.CustomerUserId != userId)
            throw new NotFoundException("Review not found.");

        return review.ToReviewDto();
    }

    public ReviewDto CreateReview(CreateReviewDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var appointment = genericRepository.GetById<Appointment>(dto.AppointmentId, asNoTracking: true)
            ?? throw new NotFoundException("Appointment not found.");

        if (appointment.CustomerUserId != userId)
            throw new NotFoundException("Appointment not found.");

        if (appointment.Status != AppointmentStatus.Completed)
            throw new BadRequestException("Reviews can only be submitted for completed appointments.");

        if (genericRepository.Exists<Review>(r => r.AppointmentId == dto.AppointmentId))
            throw new BadRequestException("A review for this appointment already exists.");

        if (dto.Rating < 1 || dto.Rating > 5)
            throw new BadRequestException("Rating must be between 1 and 5.");

        var review = new Review(dto.AppointmentId, userId, dto.Rating, dto.Comment);
        genericRepository.Insert(review);

        return review.ToReviewDto();
    }

    public ReviewDto UpdateReview(Guid reviewId, UpdateReviewDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var review = genericRepository.GetById<Review>(reviewId)
            ?? throw new NotFoundException("Review not found.");

        if (review.CustomerUserId != userId)
            throw new NotFoundException("Review not found.");

        var newRating = dto.Rating ?? review.Rating;

        if (newRating < 1 || newRating > 5)
            throw new BadRequestException("Rating must be between 1 and 5.");

        review.Update(newRating, dto.Comment ?? review.Comment);
        genericRepository.Update(review);

        return review.ToReviewDto();
    }

    public void DeleteReview(Guid reviewId)
    {
        var userId = applicationUserService.GetUserId;

        var review = genericRepository.GetById<Review>(reviewId)
            ?? throw new NotFoundException("Review not found.");

        if (review.CustomerUserId != userId)
            throw new NotFoundException("Review not found.");

        genericRepository.Delete(review);
    }
}
