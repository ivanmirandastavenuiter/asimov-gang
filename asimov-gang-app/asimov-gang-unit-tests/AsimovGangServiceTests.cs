using asimov_gang_api.Contracts;
using asimov_gang_api.Models;
using asimov_gang_api.Repositories.Contracts;
using asimov_gang_api.Services;
using AutoFixture;
using AutoFixture.AutoMoq;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Moq;
using Xunit;

namespace asimov_gang_unit_tests
{
    public class AsimovGangServiceTests
    {
        private readonly IFixture _fixture;
        private readonly Mock<IValidator<MoveForwardRequest>> _moveForwardValidator;
        private readonly Mock<IValidator<MoveToSideRequest>> _moveToSideValidator;
        private readonly Mock<IValidator<SaveRobotOutputRequest>> _saveRobotOutputValidator;
        private readonly Mock<IAsimovGangRepository> _asimovGangRepository;

        public AsimovGangServiceTests()
        {
            _fixture = new Fixture().Customize(new AutoMoqCustomization());
            _moveForwardValidator = _fixture.Freeze<Mock<IValidator<MoveForwardRequest>>>();
            _moveToSideValidator = _fixture.Freeze<Mock<IValidator<MoveToSideRequest>>>();
            _saveRobotOutputValidator = _fixture.Freeze<Mock<IValidator<SaveRobotOutputRequest>>>();
            _asimovGangRepository = _fixture.Freeze<Mock<IAsimovGangRepository>>();
        }

        [Fact]
        public void MoveForward_ReturnsOk_WhenInputParameterIsCorrect()
        {
            // Arrange
            var input = _fixture.Create<MoveForwardRequest>();
            input.CurrentOrientation = "S";

            var asimovGangService = _fixture.Create<AsimovGangService>();

            // Act
            var result = asimovGangService.MoveForward(input);

            // Assert
            result.Should().NotBeNull();
            result.CurrentOrientation.Should().Be("Y");
            result.IsIncremental.Should().Be(false);
            result.Errors.Should().BeNull();
        }

        [Fact]
        public void MoveForward_ReturnsError_WhenInputParameterIsEmpty()
        {
            // Arrange
            var input = _fixture.Create<MoveForwardRequest>();
            input.CurrentOrientation = "  ";

            var asimovGangService = _fixture.Create<AsimovGangService>();

            var responseMessage = new ValidationResult()
            {
                Errors = new List<ValidationFailure>()
                {
                    new ValidationFailure() { ErrorMessage = "Invalid orientation: cannot be null" }
                }
            };

            _moveForwardValidator.Setup(x => x.Validate(It.IsAny<MoveForwardRequest>()))
                                 .Returns(responseMessage);

            // Act
            var result = asimovGangService.MoveForward(input);

            // Assert
            result.Errors.Should().NotBeNull();
            result.Errors.Should().HaveCount(1);
            result.Errors.First().ErrorMessage.Should().Be("Invalid orientation: cannot be null");

            _moveForwardValidator.Verify(x => x.Validate(It.IsAny<MoveForwardRequest>()), Times.Once);
        }

        [Fact]
        public void MoveToSide_ReturnsOk_WhenInputParametersAreCorrect()
        {
            // Arrange
            var input = _fixture.Create<MoveToSideRequest>();
            input.CurrentOrientation = "E";
            input.Side = "L";

            var asimovGangService = _fixture.Create<AsimovGangService>();

            // Act
            var result = asimovGangService.MoveToSide(input);

            // Assert
            result.Should().NotBeNull();
            result.NewOrientation.Should().Be("N");
            result.Errors.Should().BeNull();
        }

        [Fact]
        public void MoveToSide_ReturnsError_WhenInputParametersAreEmpty()
        {
            // Arrange
            var input = _fixture.Create<MoveToSideRequest>();
            input.CurrentOrientation = "  ";
            input.Side = "  ";

            var asimovGangService = _fixture.Create<AsimovGangService>();

            var responseMessage = new ValidationResult()
            {
                Errors = new List<ValidationFailure>()
                {
                    new ValidationFailure() { ErrorMessage = "Input parameters cannot be null or empty" }
                }
            };

            _moveToSideValidator.Setup(x => x.Validate(It.IsAny<MoveToSideRequest>()))
                                 .Returns(responseMessage);

            // Act
            var result = asimovGangService.MoveToSide(input);

            // Assert
            result.Errors.Should().NotBeNull();
            result.Errors.Should().HaveCount(1);
            result.Errors.First().ErrorMessage.Should().Be("Input parameters cannot be null or empty");

            _moveToSideValidator.Verify(x => x.Validate(It.IsAny<MoveToSideRequest>()), Times.Once);
        }

        [Fact]
        public void MoveToSide_ReturnsError_WhenInputParametersDoNotHaveCorrectPattern()
        {
            // Arrange
            var input = _fixture.Create<MoveToSideRequest>();
            input.CurrentOrientation = "G";
            input.Side = "R";

            var asimovGangService = _fixture.Create<AsimovGangService>();

            var responseMessage = new ValidationResult()
            {
                Errors = new List<ValidationFailure>()
                {
                    new ValidationFailure() { ErrorMessage = "Input parameters do not have correct patterns" }
                }
            };

            _moveToSideValidator.Setup(x => x.Validate(It.IsAny<MoveToSideRequest>()))
                                 .Returns(responseMessage);

            // Act
            var result = asimovGangService.MoveToSide(input);

            // Assert
            result.Errors.Should().NotBeNull();
            result.Errors.Should().HaveCount(1);
            result.Errors.First().ErrorMessage.Should().Be("Input parameters do not have correct patterns");

            _moveToSideValidator.Verify(x => x.Validate(It.IsAny<MoveToSideRequest>()), Times.Once);
        }

        [Fact]
        public void SaveRobotOutput_ReturnsOk_WhenInputParametersAreCorrect()
        {
            // Arrange
            var input = _fixture.Create<SaveRobotOutputRequest>();
            input.Identifier = "dummy-robot-1";
            input.ExecutionData = "1 1 E";

            _asimovGangRepository.Setup(x => x.SaveRobotStatistics(It.IsAny<RobotStatistics>()))
                                 .Returns(true);

            var asimovGangService = _fixture.Create<AsimovGangService>();

            // Act
            var result = asimovGangService.SaveRobotOutput(input);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Errors.Should().BeNull();

            _asimovGangRepository.Verify(x => x.SaveRobotStatistics(It.IsAny<RobotStatistics>()), Times.Once);
        }

        [Fact]
        public void SaveRobotOutput_ReturnsError_WhenInputParametersAreEmpty()
        {
            // Arrange
            var input = _fixture.Create<SaveRobotOutputRequest>();
            input.Identifier = "  ";
            input.ExecutionData = "  ";

            var asimovGangService = _fixture.Create<AsimovGangService>();

            var responseMessage = new ValidationResult()
            {
                Errors = new List<ValidationFailure>()
                {
                    new ValidationFailure() { ErrorMessage = "Input parameters cannot be null or empty" }
                }
            };

            _saveRobotOutputValidator.Setup(x => x.Validate(It.IsAny<SaveRobotOutputRequest>()))
                                 .Returns(responseMessage);

            // Act
            var result = asimovGangService.SaveRobotOutput(input);

            // Assert
            result.Errors.Should().NotBeNull();
            result.Errors.Should().HaveCount(1);
            result.Errors.First().ErrorMessage.Should().Be("Input parameters cannot be null or empty");

            _saveRobotOutputValidator.Verify(x => x.Validate(It.IsAny<SaveRobotOutputRequest>()), Times.Once);
            _asimovGangRepository.Verify(x => x.SaveRobotStatistics(It.IsAny<RobotStatistics>()), Times.Never);
        }

        [Fact]
        public void SaveRobotOutput_ReturnsError_WhenExecutionDataDoesNotHaveCorrectPattern()
        {
            // Arrange
            var input = _fixture.Create<SaveRobotOutputRequest>();
            input.Identifier = "dummy-robot-1";
            input.ExecutionData = "1 1 G";

            var asimovGangService = _fixture.Create<AsimovGangService>();

            var responseMessage = new ValidationResult()
            {
                Errors = new List<ValidationFailure>()
                {
                    new ValidationFailure() { ErrorMessage = "Execution data is invalid: does not have proper pattern" }
                }
            };

            _saveRobotOutputValidator.Setup(x => x.Validate(It.IsAny<SaveRobotOutputRequest>()))
                                 .Returns(responseMessage);

            // Act
            var result = asimovGangService.SaveRobotOutput(input);

            // Assert
            result.Errors.Should().NotBeNull();
            result.Errors.Should().HaveCount(1);
            result.Errors.First().ErrorMessage.Should().Be("Execution data is invalid: does not have proper pattern");

            _saveRobotOutputValidator.Verify(x => x.Validate(It.IsAny<SaveRobotOutputRequest>()), Times.Once);
            _asimovGangRepository.Verify(x => x.SaveRobotStatistics(It.IsAny<RobotStatistics>()), Times.Never);
        }
    }
}