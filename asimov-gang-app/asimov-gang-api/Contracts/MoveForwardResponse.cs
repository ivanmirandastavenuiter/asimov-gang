using FluentValidation.Results;

namespace asimov_gang_api.Contracts
{
    public class MoveForwardResponse
    {
        public string CurrentOrientation { get; set; }
        public bool IsIncremental { get; set; }
        public IList<ValidationFailure> Errors { get; set; }
    }
}
