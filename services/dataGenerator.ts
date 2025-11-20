import { DRIVERS, RACES_2024 } from '../constants';
import { LapData, RaceAnalysisData } from '../types';

// Helper to generate semi-realistic lap data for a selected race
export const generateRaceData = (raceId: string): RaceAnalysisData => {
  const race = RACES_2024.find(r => r.id === raceId);
  if (!race) throw new Error('Race not found');

  const drivers = [...DRIVERS];
  const history: LapData[] = [];

  // Initial random starting order
  let currentOrder = [...drivers].sort(() => Math.random() - 0.5);

  // Base lap time for the circuit (approx 90s)
  const baseTime = 90; 

  for (let lap = 1; lap <= race.laps; lap++) {
    // Simulate pit stops around lap 15-25 and 40-50
    const isPitWindow = (lap >= 18 && lap <= 24) || (lap >= 40 && lap <= 45);

    currentOrder.forEach((driver, index) => {
      // Randomize performance slightly
      let lapTime = baseTime + (Math.random() * 2 - 1); // +/- 1 sec variablity
      
      // Pit stop logic
      let tyre: 'S' | 'M' | 'H' = 'M';
      if (lap < 20) tyre = 'S';
      else if (lap < 45) tyre = 'H';
      else tyre = 'S';

      // Simulate Pit Stop time loss
      if (isPitWindow && Math.random() > 0.85) {
         lapTime += 20; 
      }

      // Chaos factor (overtakes)
      if (Math.random() > 0.9 && index > 0) {
        // Swap with car ahead
        const temp = currentOrder[index];
        currentOrder[index] = currentOrder[index - 1];
        currentOrder[index - 1] = temp;
      }
      
      // Push data
      // Note: In this simple generator, we calculate position based on current array index
      // In a real app, we would sort by accumulated time. 
      // For viz purposes, array index is the "position" for this lap.
      history.push({
        lap,
        driverId: driver.id,
        position: index + 1, // 1-based
        time: lapTime,
        tyre
      });
    });
  }

  return {
    race,
    drivers,
    history
  };
};