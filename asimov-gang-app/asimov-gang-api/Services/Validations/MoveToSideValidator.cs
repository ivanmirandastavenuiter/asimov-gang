using System.Text.RegularExpressions;
using asimov_gang_api.Contracts;
using FluentValidation;

namespace asimov_gang_api.Controllers.Validations
{
    public sealed class MoveToSideValidator : AbstractValidator<MoveToSideRequest>
    {
        public MoveToSideValidator()
        {
            CheckInputParametersAreNotEmpty();
            CheckCompliesPatterns();
        }

        private void CheckInputParametersAreNotEmpty()
        {
            RuleFor(x => x)
                .Must(x => !string.IsNullOrWhiteSpace(x.CurrentOrientation) && !string.IsNullOrWhiteSpace(x.Side))
                .WithMessage("Input parameters cannot be null or empty")
                .WithErrorCode("400");
        }

        private void CheckCompliesPatterns()
        {
            RuleFor(x => x)
                .Must(x =>
                {
                    var orientationMatch = Regex.Match(x.CurrentOrientation, "^[NSWE]{1}$").Success;
                    var sideMatch = Regex.Match(x.Side, "^[LR]{1}$").Success;

                    return orientationMatch && sideMatch;
                })
                .WithMessage("Input parameters do not have correct patterns")
                .WithErrorCode("400");
        }
    }
}
