export interface RobotTrackData {
    currentXAxis: number;
    currentYAxis: number;
    currentOrientation: string;
    currentCellElement: Element;
    robotIdentifier: string;
}

export interface ProgressionRecord {
    xAxis: number;
    yAxis: number;
    orientation: string;
    isOff: boolean;
}