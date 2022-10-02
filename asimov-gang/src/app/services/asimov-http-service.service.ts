import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoveForwardRequest, MoveForwardResponse, MoveToSideRequest, MoveToSideResponse, SaveRobotStatistics, SaveRobotStatisticsResponse } from './interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AsimovHttpService {

  private readonly baseUrl: string = "http://localhost";
  private readonly port: number = 45000;
  private readonly moveForwardEndpoint = "/asimovgang/moveForward";
  private readonly moveToSideEndpoint = "/asimovgang/moveToSide";
  private readonly saveRobotStatisticsEndpoint = "/asimovgang/saveRobotOutput";
  private readonly getStatisticsEndpoint = "/asimovgang/getStatistics";

  constructor(private http: HttpClient) { }

  public moveForward(orientation: string) {
    var request: MoveForwardRequest = {
      CurrentOrientation: orientation
    };

    return this.http.post<MoveForwardResponse>(`${this.baseUrl}:${this.port}${this.moveForwardEndpoint}`, request);
  }

  public moveToSide(orientation: string, side: string) {
    var request: MoveToSideRequest = {
      CurrentOrientation: orientation,
      Side: side
    };

    return this.http.post<MoveToSideResponse>(`${this.baseUrl}:${this.port}${this.moveToSideEndpoint}`, request);
  }

  public saveRobotOutput(identifier: string, executionData: string) {
    var request: SaveRobotStatistics = {
      Identifier: identifier,
      ExecutionData: executionData
    }

    return this.http.post<number>(`${this.baseUrl}:${this.port}${this.saveRobotStatisticsEndpoint}`, request);
  }

  public getStatistics() {
    return this.http.get<SaveRobotStatisticsResponse[]>(`${this.baseUrl}:${this.port}${this.getStatisticsEndpoint}`);
  }
}
