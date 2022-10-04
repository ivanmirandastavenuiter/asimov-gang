import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { SharedFormData } from '../asimov-input/interfaces/interfaces';
import { AsimovHttpService } from '../services/asimov-http-service.service';
import { MoveForwardResponse, MoveToSideResponse, SaveRobotStatistics, SaveRobotStatisticsResponse } from '../services/interfaces/interfaces';
import { ProgressionRecord, RobotTrackData } from './interfaces/interfaces';

@Component({
  selector: 'app-asimov-grid',
  templateUrl: './asimov-grid.component.html',
  styleUrls: ['./asimov-grid.component.scss']
})
export class AsimovGridComponent implements OnInit {

  public yAxis!: number[];
  public xAxis!: number[];

  public robotTrackData!: RobotTrackData;
  public currentRobotExecutionIdentifier!: string;

  public readonly robotItemClassReference: string[] = ["dv-lvl-6", "robot-item"];
  public readonly robotItemArrowClassReference: string[] = ["fas", "fa-caret-up"];

  public isDataLoaded!: boolean;

  public currentExecutionDone: boolean = false;
  public hasExecutionBeenInterrupted: boolean = false;
  public executionInterval: any;

  public progressionRecords: ProgressionRecord[] = [];
  public statistics: SaveRobotStatisticsResponse[] = [];

  @Input('sharedFormData') sharedFormData!: SharedFormData;

  constructor(private elRef: ElementRef, private renderer: Renderer2, private asimovHttpService: AsimovHttpService) { }

  /**
   * On changes hook
   * 
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges) {
    this.sharedFormData = changes['sharedFormData'].currentValue as SharedFormData;
    this.setCoordinatesForCells();
    this.setInitialRobotPosition();
  } 

  /**
   * On init hook
   */
  ngOnInit(): void {
  }

  /**
   * Set initial coordinates for cells
   */
  setCoordinatesForCells() {
    let yAxisCoordinates = this.sharedFormData?.gridSetupForm.value.gridSetupYAxis;
    let xAxisCoordinates = this.sharedFormData?.gridSetupForm.value.gridSetupXAxis;

    if (xAxisCoordinates != undefined && xAxisCoordinates != undefined) {
      this.yAxis = Array.from(Array(parseInt(yAxisCoordinates) + 1).keys()).reverse();
      this.xAxis = Array.from(Array(parseInt(xAxisCoordinates) + 1).keys());

      this.isDataLoaded = true;
    }
  }
  
  /**
   * Set robots at initial position
   * 
   * Core method for bootstrapping each robot at the correct time
   * 
   * Timeouts are calculated from the beginning, as iteration comes all at once
   * 
   * 2.5 seconds are provided as extended margin to give a friendly pause after each execution
   */
  setInitialRobotPosition() {
    setTimeout(() => {
      let executions = this.sharedFormData?.robotsFormGroups;

      let initialTimeout = 0;
      let instructionsPerTime = 0;
      let index = 1;
      
      if (executions != undefined) {
        for (let execution of executions) {
          let instructions = execution.value.instructions;

          setTimeout(() => {
            this.hasExecutionBeenInterrupted = false;

            this.robotTrackData = {
              ...this.robotTrackData,
              robotIdentifier: execution.value.identifier
            }

            let initialXPos = execution.value.xAxis;
            let initialYPos = execution.value.yAxis;
            let initialOrientation = execution.value.orientation;
            this.setRobotTrackData(initialXPos, initialYPos, initialOrientation);
            this.triggerRobotActions(instructions);
          }, initialTimeout);
          initialTimeout = 1000;

          instructionsPerTime += instructions.length;
          initialTimeout = (initialTimeout * instructionsPerTime) + (2500 * index);
          console.log(`Job ${index} waits ${initialTimeout} seconds`);

          if (index === executions.length) {
            setTimeout(() => {
              this.getStatistics();
            }, initialTimeout);
          }
          index++;
        }
      }
    }, .1);
  }

  /**
   * Triggers the moves for each robot
   * 
   * @param instructions 
   */
  triggerRobotActions(instructions: string) {
    let instructionsParsed = instructions.split('');
    let interval = 1000;
    let index = 0;

    this.executionInterval = setInterval(() => {
      let instruction = instructionsParsed[index];
      let isLastMove = instructionsParsed.length === index + 1;
      this.executeNextMove(instruction, isLastMove);
      index++;

      if (isLastMove) {
        clearInterval(this.executionInterval);
      }
    }, interval);
  }

  /**
   * Set proper styles for each orientation
   * 
   * @param arrowElement 
   * @param orientation 
   */
  setOrientationStyles(arrowElement: Element, orientation: string) {
    switch (orientation) {
      case 'N':
        this.renderer.setStyle(arrowElement, 'top', '0');
        break;
      case 'S':
        this.renderer.setStyle(arrowElement, 'bottom', '0');
        this.renderer.setStyle(arrowElement, 'transform', 'rotate(180deg)');
        break;
      case 'E':
        this.renderer.setStyle(arrowElement, 'right', '5px');
        this.renderer.setStyle(arrowElement, 'transform', 'rotate(90deg)');
        break;
      case 'W':
        this.renderer.setStyle(arrowElement, 'left', '5px');
        this.renderer.setStyle(arrowElement, 'transform', 'rotate(270deg)');
        break;
    }
  }

  /**
   * Decides the next action for the robot
   * 
   * @param nextInstruction 
   * @param isLastMove 
   */
  executeNextMove(nextInstruction: string, isLastMove: boolean) {
    switch (nextInstruction) {
      case 'F':
        this.moveForward(isLastMove);
        break;
      case 'R':
        this.moveRight(isLastMove);
        break;
      case 'L':
        this.moveLeft(isLastMove);
        break;
    }
  }

  /**
   * Move forward action
   * 
   * @param isLastMove 
   */
  moveForward(isLastMove: boolean) {
    this.robotTrackData.currentCellElement.innerHTML = '';

    this.asimovHttpService.moveForward(this.robotTrackData.currentOrientation).subscribe((data: MoveForwardResponse) => {
      let isIncremental = data.isIncremental;
      let currentOrientationAxis = data.currentOrientation;
      if (isIncremental) {
        if (currentOrientationAxis === 'X') {
          let pos = this.robotTrackData.currentXAxis + 1;
          this.checkBoundaries(pos, 'X');
          this.setRobotTrackData(pos, this.robotTrackData.currentYAxis, this.robotTrackData.currentOrientation);
        } else {
          let pos = this.robotTrackData.currentYAxis + 1;
          this.checkBoundaries(pos, 'Y');
          this.setRobotTrackData(this.robotTrackData.currentXAxis, pos, this.robotTrackData.currentOrientation);
        }
      } else {
        if (currentOrientationAxis === 'X') {
          let pos = this.robotTrackData.currentXAxis - 1;
          this.checkBoundaries(pos, 'X');
          this.setRobotTrackData(pos, this.robotTrackData.currentYAxis, this.robotTrackData.currentOrientation);
        } else {
          let pos = this.robotTrackData.currentYAxis - 1;
          this.checkBoundaries(pos, 'Y');
          this.setRobotTrackData(this.robotTrackData.currentXAxis, pos, this.robotTrackData.currentOrientation);
        }
      }
  
      this.currentExecutionDone = isLastMove || this.hasExecutionBeenInterrupted;

      if (this.hasExecutionBeenInterrupted) {
        this.saveRobotOutput();
      }
  
      if (isLastMove) {
        setTimeout(() => {
          this.robotTrackData.currentCellElement.innerHTML = '';
          this.progressionRecords.push({
            xAxis: this.robotTrackData.currentXAxis,
            yAxis: this.robotTrackData.currentYAxis,
            orientation: this.robotTrackData.currentOrientation,
            isOff: this.hasExecutionBeenInterrupted
          });
          this.saveRobotOutput();
        }, 1000);
      }
    });

  }

  /**
   * Move right action
   * 
   * @param isLastMove 
   */
  moveRight(isLastMove: boolean) {
    this.asimovHttpService.moveToSide(this.robotTrackData.currentOrientation, "R").subscribe((data: MoveToSideResponse) => {
      let newOrientation = data.newOrientation;
      this.setRobotTrackData(this.robotTrackData.currentXAxis, this.robotTrackData.currentYAxis, newOrientation);
      this.currentExecutionDone = isLastMove || this.hasExecutionBeenInterrupted;
  
      if (isLastMove) {
        setTimeout(() => {
          this.robotTrackData.currentCellElement.innerHTML = '';
          this.progressionRecords.push({
            xAxis: this.robotTrackData.currentXAxis,
            yAxis: this.robotTrackData.currentYAxis,
            orientation: this.robotTrackData.currentOrientation,
            isOff: this.hasExecutionBeenInterrupted
          });
          this.saveRobotOutput();

        }, 1000);
      }
    });

  }

  /**
   * Move left action
   * 
   * @param isLastMove 
   */
  moveLeft(isLastMove: boolean) {
    this.asimovHttpService.moveToSide(this.robotTrackData.currentOrientation, "L").subscribe((data: MoveToSideResponse) => {
      let newOrientation = data.newOrientation;
      this.setRobotTrackData(this.robotTrackData.currentXAxis, this.robotTrackData.currentYAxis, newOrientation);
      this.currentExecutionDone = isLastMove || this.hasExecutionBeenInterrupted;;
  
      if (isLastMove) {
        setTimeout(() => {
          this.robotTrackData.currentCellElement.innerHTML = '';
          this.progressionRecords.push({
            xAxis: this.robotTrackData.currentXAxis,
            yAxis: this.robotTrackData.currentYAxis,
            orientation: this.robotTrackData.currentOrientation,
            isOff: this.hasExecutionBeenInterrupted
          });
          this.saveRobotOutput();

        }, 1000);
      }
    });

  }

  /**
   * Set current tracking data for the robot
   * 
   * @param xPos 
   * @param yPos 
   * @param orientation 
   */
  setRobotTrackData(xPos: number, yPos: number, orientation: string) {
    if (!this.hasExecutionBeenInterrupted) {
      const row = this.elRef.nativeElement.querySelector(`.y-cell-axis-${yPos}`);
      const cell = row.querySelector(`.x-cell-axis-${xPos}`);
      cell.innerHTML = '';
      let robotElement = this.renderer.createElement('div');
      this.robotItemClassReference.forEach(reference => this.renderer.addClass(robotElement, reference));
      let robotArrowElement = this.renderer.createElement('i');
      this.setOrientationStyles(robotArrowElement, orientation);
      this.robotItemArrowClassReference.forEach(reference => this.renderer.addClass(robotArrowElement, reference));
      this.renderer.appendChild(cell, robotElement);
      this.renderer.appendChild(cell, robotArrowElement);
      this.robotTrackData = {
        currentXAxis: parseInt(xPos.toString()),
        currentYAxis: parseInt(yPos.toString()),
        currentCellElement: cell,
        currentOrientation: orientation,
        robotIdentifier: this.robotTrackData?.robotIdentifier 
      };
    }
  }

  /**
   * Checks robot boundaries inside grid
   * 
   * @param pos 
   * @param axis 
   */
  checkBoundaries(pos: number, axis: string) {
    if (axis === 'Y') {
      if (pos < 0 || pos > this.yAxis[0]) {
        this.interruptExecution();
      }
    } else {
      if (pos < 0 || pos > this.xAxis[this.xAxis.length - 1]) {
        this.interruptExecution();
      }
    }
  }

  /**
   * Execute needed actions in case of lost robot
   */
  interruptExecution() {
    clearInterval(this.executionInterval);
    this.hasExecutionBeenInterrupted = true;
    this.currentExecutionDone = true;
    this.setRobotOffCellIndicator();
  }

  /**
   * Sets robot lost indicator
   */
  setRobotOffCellIndicator() {
    let cell = this.robotTrackData.currentCellElement;
    this.renderer.setStyle(cell, 'background', 'red');

    this.progressionRecords.push({
      xAxis: this.robotTrackData.currentXAxis,
      yAxis: this.robotTrackData.currentYAxis,
      orientation: this.robotTrackData.currentOrientation,
      isOff: this.hasExecutionBeenInterrupted
    });

    setTimeout(() => {
      this.renderer.removeStyle(cell, 'background');
    }, 1000);
  }

  /**
   * Saves execution data when robot finishes the path
   */
  saveRobotOutput() {
    const executionSteps = `${this.robotTrackData.currentXAxis} ` +
                           `${this.robotTrackData.currentYAxis} ` +
                           `${this.robotTrackData.currentOrientation}` +
                           `${this.hasExecutionBeenInterrupted ? ' LOST' : '' }`;

    this.asimovHttpService.saveRobotOutput(this.robotTrackData.robotIdentifier, executionSteps).subscribe();
  }

  /**
   * Gets final statistics when all executions are done
   */
  getStatistics() {
    this.asimovHttpService.getStatistics().subscribe((data: SaveRobotStatisticsResponse[]) => {
      this.statistics = data;
    });
  }
}
