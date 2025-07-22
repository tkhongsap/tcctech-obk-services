import {PositionUpdater, TGeolocationObject} from '@mappedin/mappedin-js';

const ms = async (time: number) =>
  new Promise(resolve => setTimeout(() => resolve(time), time));

export default class DynamicPositionUpdater {
  updater: PositionUpdater;
  interval?: number;
  positions: TGeolocationObject[] = [];
  speed: number = 1000;

  constructor() {
    this.updater = new PositionUpdater();
  }

  /**
   * Cancel any existing position updates
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  /**
   * Start a new set of position updates
   */
  start(positions: TGeolocationObject[], speed: number) {
    // Save the most recent settings
    this.positions = positions;
    this.speed = speed;

    // Stop any existing updates
    this.stop();

    // Start a new set of updates
    let i = 0;
    this.interval = setInterval(() => {
      this.updater.update(positions[i]);
      i++;
      if (i >= positions.length) {
        this.stop();
      }
    }, speed);
  }

  /**
   * Stops updates and emits an update back at the beginning
   */
  async reset() {
    this.stop();
    await ms(this.speed);
    if (this.positions.length > 0) {
      this.updater.update(this.positions[0]);
    }
  }
}
