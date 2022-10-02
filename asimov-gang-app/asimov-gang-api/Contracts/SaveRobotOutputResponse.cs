using FluentValidation.Results;

namespace asimov_gang_api.Contracts
{
    public class SaveRobotOutputResponse
    {
        public bool Success { get; set; }
        public IList<ValidationFailure> Errors { get; set; }
    }
}
