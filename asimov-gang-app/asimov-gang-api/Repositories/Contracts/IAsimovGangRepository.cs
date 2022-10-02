using asimov_gang_api.Models;

namespace asimov_gang_api.Repositories.Contracts
{
    public interface IAsimovGangRepository
    {
        public List<RobotStatistics> GetExecutionData();
        public bool SaveRobotStatistics(RobotStatistics robotStatistics);
    }
}
