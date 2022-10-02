using asimov_gang_api.Contracts;
using asimov_gang_api.Models;
using asimov_gang_api.Repositories.Contracts;
using asimov_gang_api.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace asimov_gang_api.Controllers;

[ApiController]
[Route("[controller]")]
public class AsimovGangController : ControllerBase
{
    private readonly ILogger<AsimovGangController> _logger;
    private readonly IAsimovGangService _asimovGangService;
    //private readonly IAsimovGangRepository _asimovGangRepository;

    //private readonly IValidator<MoveForwardRequest> _moveForwardRequestValidator;
    //private readonly IValidator<MoveToSideRequest> _moveToSideValidator;
    //private readonly IValidator<SaveRobotOutputRequest> _saveRobotOutputValidator;

    //private static readonly List<string> _orientationReferences = new List<string> { "N", "E", "S", "W" };

    public AsimovGangController(
        ILogger<AsimovGangController> logger, 
        IAsimovGangService asimovGangService,
        IAsimovGangRepository asimovGangRepository,
        IValidator<MoveForwardRequest> moveForwardRequestValidator,
        IValidator<MoveToSideRequest> moveToSideValidator,
        IValidator<SaveRobotOutputRequest> saveRobotOutputValidator)
    {
        //_asimovGangRepository = asimovGangRepository;
        _logger = logger;
        _asimovGangService = asimovGangService;
        //_moveForwardRequestValidator = moveForwardRequestValidator;
        //_moveToSideValidator = moveToSideValidator;
        //_saveRobotOutputValidator = saveRobotOutputValidator;
    }

    [HttpPost("moveForward")]
    public ActionResult<MoveForwardResponse> ExecuteNextStep([FromBody] MoveForwardRequest request)
    {
        var response = _asimovGangService.MoveForward(request);

        if (response.Errors != null)
        {
            return BadRequest(response.Errors);
        }

        return Ok(response);
    }

    [HttpPost("moveToSide")]
    public ActionResult<string> MoveToSide([FromBody] MoveToSideRequest request)
    {
        var response = _asimovGangService.MoveToSide(request);

        if (response.Errors != null)
        {
            return BadRequest(response.Errors);
        }

        return Ok(response);
    }

    [HttpPost("saveRobotOutput")]
    public ActionResult<string> SaveRobotOutput([FromBody] SaveRobotOutputRequest request)
    {
        var response = _asimovGangService.SaveRobotOutput(request);

        if (response.Errors != null)
        {
            return BadRequest(response.Errors);
        }

        return Created("saveRobotOutput", 201);
    }

    [HttpGet("getStatistics")]
    public ActionResult<List<RobotStatistics>> GetStatistics()
    {
        var response = _asimovGangService.GetStatistics();
        return Ok(response);
    }
}
