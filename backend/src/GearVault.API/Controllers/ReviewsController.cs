using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.Common.Response;
using GearVault.Application.DTOs.Reviews;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/reviews")]
public class ReviewsController(IReviewService reviewService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetMyReviews", "Retrieve all reviews submitted by the current user.")]
    public ResponseDto<List<ReviewDto>> GetMyReviews()
    {
        var result = reviewService.GetMyReviews();
        return new ResponseDto<List<ReviewDto>>(
            (int)HttpStatusCode.OK,
            "Reviews retrieved successfully.",
            result);
    }

    [HttpGet("{reviewId:guid}")]
    [Documentation("GetReviewById", "Retrieve a review by identifier.")]
    public ResponseDto<ReviewDto> GetReviewById([FromRoute] Guid reviewId)
    {
        var result = reviewService.GetReviewById(reviewId);
        return new ResponseDto<ReviewDto>(
            (int)HttpStatusCode.OK,
            "Review retrieved successfully.",
            result);
    }

    [HttpPost]
    [Documentation("CreateReview", "Submit a review for a completed appointment.")]
    public ResponseDto<ReviewDto> CreateReview([FromBody] CreateReviewDto dto)
    {
        var result = reviewService.CreateReview(dto);
        return new ResponseDto<ReviewDto>(
            (int)HttpStatusCode.Created,
            "Review created successfully.",
            result);
    }

    [HttpPut("{reviewId:guid}")]
    [Documentation("UpdateReview", "Update an existing review.")]
    public ResponseDto<ReviewDto> UpdateReview([FromRoute] Guid reviewId, [FromBody] UpdateReviewDto dto)
    {
        var result = reviewService.UpdateReview(reviewId, dto);
        return new ResponseDto<ReviewDto>(
            (int)HttpStatusCode.OK,
            "Review updated successfully.",
            result);
    }

    [HttpDelete("{reviewId:guid}")]
    [Documentation("DeleteReview", "Delete a review.")]
    public ResponseDto<bool> DeleteReview([FromRoute] Guid reviewId)
    {
        reviewService.DeleteReview(reviewId);
        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Review deleted successfully.",
            true);
    }
}
