using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
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
    public ActionResult<List<ReviewDto>> GetMyReviews()
    {
        var result = reviewService.GetMyReviews();
        return Ok(result);
    }

    [HttpGet("{reviewId:guid}")]
    [Documentation("GetReviewById", "Retrieve a review by identifier.")]
    public ActionResult<ReviewDto> GetReviewById([FromRoute] Guid reviewId)
    {
        var result = reviewService.GetReviewById(reviewId);
        return Ok(result);
    }

    [HttpPost]
    [Documentation("CreateReview", "Submit a review for a completed appointment.")]
    public ActionResult<ReviewDto> CreateReview([FromBody] CreateReviewDto dto)
    {
        var result = reviewService.CreateReview(dto);
        return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPut("{reviewId:guid}")]
    [Documentation("UpdateReview", "Update an existing review.")]
    public ActionResult<ReviewDto> UpdateReview([FromRoute] Guid reviewId, [FromBody] UpdateReviewDto dto)
    {
        var result = reviewService.UpdateReview(reviewId, dto);
        return Ok(result);
    }

    [HttpDelete("{reviewId:guid}")]
    [Documentation("DeleteReview", "Delete a review.")]
    public ActionResult DeleteReview([FromRoute] Guid reviewId)
    {
        reviewService.DeleteReview(reviewId);
        return NoContent();
    }
}
