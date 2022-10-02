using System.Text.RegularExpressions;
using asimov_gang_api.Contracts;
using FluentValidation;

namespace asimov_gang_api.Controllers.Validations
{
    public sealed class SaveRobotOutputValidator : AbstractValidator<SaveRobotOutputRequest>
    {
        public SaveRobotOutputValidator()
        {
            CheckInputParametersAreNotEmpty();
            CheckExecutionDataIsValid();
        }

        private void CheckInputParametersAreNotEmpty()
        {
            RuleFor(x => x)
                .Must(x => !string.IsNullOrWhiteSpace(x.Identifier) && !string.IsNullOrWhiteSpace(x.ExecutionData))
                .WithMessage("Input parameters cannot be null or empty")
                .WithErrorCode("400");
        }

        private void CheckExecutionDataIsValid()
        {
            RuleFor(x => x)
                .Must(x =>
                {
                    var executionDataMatch = Regex.Match(x.ExecutionData, "^[0-9]{1,2}\\s[0-9]{1,2}\\s[NSWE]{1}(\\sLOST)?$").Success;

                    return executionDataMatch;
                })
                .WithMessage("Execution data is invalid: does not have proper pattern")
                .WithErrorCode("400");
        }
    }
}
