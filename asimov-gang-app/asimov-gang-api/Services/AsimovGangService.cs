using asimov_gang_api.Contracts;
using asimov_gang_api.Models;
using asimov_gang_api.Repositories.Contracts;
using FluentValidation;

namespace asimov_gang_api.Services
{
    public class AsimovGangService : IAsimovGangService
    {
        private readonly IValidator<MoveForwardRequest> _moveForwardRequestValidator;
        private readonly IValidator<MoveToSideRequest> _moveToSideValidator;
        private readonly IValidator<SaveRobotOutputRequest> _saveRobotOutputValidator;
        private readonly IAsimovGangRepository _asimovGangRepository;

        private static readonly List<string> _orientationReferences = new List<string> { "N", "E", "S", "W" };

        public AsimovGangService(
            IAsimovGangRepository asimovGangRepository,
            IValidator<MoveForwardRequest> moveForwardRequestValidator,
            IValidator<MoveToSideRequest> moveToSideValidator,
            IValidator<SaveRobotOutputRequest> saveRobotOutputValidator)
        {
            _asimovGangRepository = asimovGangRepository;
            _moveForwardRequestValidator = moveForwardRequestValidator;
            _moveToSideValidator = moveToSideValidator;
            _saveRobotOutputValidator = saveRobotOutputValidator;
        }

        public MoveForwardResponse MoveForward(MoveForwardRequest request)
        {
            var validation = _moveForwardRequestValidator.Validate(request);

            if (!validation.IsValid)
            {
                return new MoveForwardResponse() { Errors = validation.Errors };
            }

            var currentOrientationAxis = new string[] { "E", "W" }.Contains(request.CurrentOrientation) ? "X" : "Y";
            var isIncremental = new string[] { "N", "E" }.Contains(request.CurrentOrientation) ? true : false;

            return new MoveForwardResponse() { CurrentOrientation = currentOrientationAxis, IsIncremental = isIncremental };
        }

        public MoveToSideResponse MoveToSide(MoveToSideRequest request)
        {
            var validation = _moveToSideValidator.Validate(request);
            
            if (!validation.IsValid)
            {
                return new MoveToSideResponse() { Errors = validation.Errors };
            }

            var newOrientation = "";
            if (request.Side.Equals("L"))
            {
                var index = _orientationReferences.FindIndex(or => or == request.CurrentOrientation) - 1;
                newOrientation = index < 0 ? _orientationReferences[_orientationReferences.Count - 1] : _orientationReferences[index];
            }
            else
            {
                var index = _orientationReferences.FindIndex(or => or == request.CurrentOrientation) + 1;
                newOrientation = index == _orientationReferences.Count ? _orientationReferences[0] : _orientationReferences[index];
            }
            return new MoveToSideResponse() { NewOrientation = newOrientation };
        }

        public SaveRobotOutputResponse SaveRobotOutput(SaveRobotOutputRequest request)
        {
            var validation = _saveRobotOutputValidator.Validate(request);

            if (!validation.IsValid)
            {
                return new SaveRobotOutputResponse() { Errors = validation.Errors };
            }

            var robotStatistics = new RobotStatistics() { Identifier = request.Identifier, ExecutionData = request.ExecutionData };

            var result = _asimovGangRepository.SaveRobotStatistics(robotStatistics);

            return new SaveRobotOutputResponse { Success = result };
        }

        public IList<RobotStatistics> GetStatistics()
        {
            var statistics = _asimovGangRepository.GetExecutionData();
            return statistics;
        }
    }
}
