using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.Reviews;

namespace GearVault.Application.Interfaces.Services;

public interface IReviewService : ITransientService
{
    List<ReviewDto> GetMyReviews();

    ReviewDto GetReviewById(Guid reviewId);

    ReviewDto CreateReview(CreateReviewDto dto);

    ReviewDto UpdateReview(Guid reviewId, UpdateReviewDto dto);

    void DeleteReview(Guid reviewId);
}
