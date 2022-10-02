using asimov_gang_api.Contracts;
using asimov_gang_api.Models;

namespace asimov_gang_api.Services
{
    public interface IAsimovGangService
    {
        MoveForwardResponse MoveForward(MoveForwardRequest request);
        MoveToSideResponse MoveToSide(MoveToSideRequest request);
        SaveRobotOutputResponse SaveRobotOutput(SaveRobotOutputRequest request);
        public IList<RobotStatistics> GetStatistics();
    }
}
