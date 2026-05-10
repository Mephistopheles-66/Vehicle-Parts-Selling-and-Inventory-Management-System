using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.Reviews;

public static class ReviewExtensionMethod
{
    public static ReviewDto ToReviewDto(this Review review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            AppointmentId = review.AppointmentId,
            CustomerUserId = review.CustomerUserId,
            Rating = review.Rating,
            Comment = review.Comment,
            IsActive = review.IsActive,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        };
    }
}
