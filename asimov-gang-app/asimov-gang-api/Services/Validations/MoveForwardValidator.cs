using asimov_gang_api.Contracts;
using FluentValidation;

namespace asimov_gang_api.Controllers.Validations
{
    public sealed class MoveForwardValidator : AbstractValidator<MoveForwardRequest>
    {
        public MoveForwardValidator()
        {
            CheckOrientationIsValid();
        }

        private void CheckOrientationIsValid()
        {
            RuleFor(x => x.CurrentOrientation)
                .Must(orientation => !string.IsNullOrWhiteSpace(orientation))
                .WithMessage("Invalid orientation: cannot be null")
                .WithErrorCode("400");
        }
    }
}
