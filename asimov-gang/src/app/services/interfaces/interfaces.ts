export interface MoveForwardRequest {
    CurrentOrientation: string;
}

export interface MoveForwardResponse {
    currentOrientation: string;
    isIncremental: boolean;
}

export interface MoveToSideRequest {
    CurrentOrientation: string;
    Side: string;
}

export interface MoveToSideResponse {
    newOrientation: string;
}

export interface SaveRobotStatistics {
    Identifier: string;
    ExecutionData: string;
}

export interface SaveRobotStatisticsResponse {
    identifier: string;
    executionData: string;
}