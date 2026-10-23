import { DriverStanding, ConstructorStanding } from '../types';
import { DRIVER_DETAILS_MAP, TEAM_ASSETS } from '../constants';

export const SEASON_2025_DRIVER_STANDINGS: DriverStanding[] = [
  {
    "driverNumber": "4",
    "driverName": "Lando Norris",
    "code": "NOR",
    "team": "McLaren",
    "teamColor": "#FF8000",
    "points": 394.0,
    "wins": 7,
    "podiums": 18,
    "fastestLaps": 5,
    "countryCode": "GBR",
    "position": 1,
    "diff": 0.0
  },
  {
    "driverNumber": "1",
    "driverName": "Max Verstappen",
    "code": "VER",
    "team": "Red Bull Racing",
    "teamColor": "#3671C6",
    "points": 389.0,
    "wins": 8,
    "podiums": 15,
    "fastestLaps": 3,
    "countryCode": "NED",
    "position": 2,
    "diff": -5.0
  },
  {
    "driverNumber": "81",
    "driverName": "Oscar Piastri",
    "code": "PIA",
    "team": "McLaren",
    "teamColor": "#FF8000",
    "points": 381.0,
    "wins": 7,
    "podiums": 16,
    "fastestLaps": 6,
    "countryCode": "AUS",
    "position": 3,
    "diff": -13.0
  },
  {
    "driverNumber": "63",
    "driverName": "George Russell",
    "code": "RUS",
    "team": "Mercedes",
    "teamColor": "#27F4D2",
    "points": 289.0,
    "wins": 2,
    "podiums": 9,
    "fastestLaps": 3,
    "countryCode": "GBR",
    "position": 4,
    "diff": -105.0
  },
  {
    "driverNumber": "16",
    "driverName": "Charles Leclerc",
    "code": "LEC",
    "team": "Ferrari",
    "teamColor": "#E80020",
    "points": 225.0,
    "wins": 0,
    "podiums": 7,
    "fastestLaps": 1,
    "countryCode": "MON",
    "position": 5,
    "diff": -169.0
  },
  {
    "driverNumber": "12",
    "driverName": "Kimi Antonelli",
    "code": "ANT",
    "team": "Mercedes",
    "teamColor": "#27F4D2",
    "points": 135.0,
    "wins": 0,
    "podiums": 3,
    "fastestLaps": 3,
    "countryCode": "ITA",
    "position": 6,
    "diff": -259.0
  },
  {
    "driverNumber": "44",
    "driverName": "Lewis Hamilton",
    "code": "HAM",
    "team": "Ferrari",
    "teamColor": "#E80020",
    "points": 135.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 2,
    "countryCode": "GBR",
    "position": 7,
    "diff": -259.0
  },
  {
    "driverNumber": "23",
    "driverName": "Alexander Albon",
    "code": "ALB",
    "team": "Mercedes",
    "teamColor": "#27F4D2",
    "points": 70.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 1,
    "countryCode": "THA",
    "position": 8,
    "diff": -324.0
  },
  {
    "driverNumber": "55",
    "driverName": "Carlos Sainz",
    "code": "SAI",
    "team": "Mercedes",
    "teamColor": "#27F4D2",
    "points": 54.0,
    "wins": 0,
    "podiums": 2,
    "fastestLaps": 0,
    "countryCode": "ESP",
    "position": 9,
    "diff": -340.0
  },
  {
    "driverNumber": "27",
    "driverName": "Nico Hulkenberg",
    "code": "HUL",
    "team": "Ferrari",
    "teamColor": "#E80020",
    "points": 51.0,
    "wins": 0,
    "podiums": 1,
    "fastestLaps": 0,
    "countryCode": "GER",
    "position": 10,
    "diff": -343.0
  },
  {
    "driverNumber": "14",
    "driverName": "Fernando Alonso",
    "code": "ALO",
    "team": "Mercedes",
    "teamColor": "#27F4D2",
    "points": 51.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "ESP",
    "position": 11,
    "diff": -343.0
  },
  {
    "driverNumber": "6",
    "driverName": "Isack Hadjar",
    "code": "HAD",
    "team": "RB",
    "teamColor": "#6692FF",
    "points": 50.0,
    "wins": 0,
    "podiums": 1,
    "fastestLaps": 0,
    "countryCode": "FRA",
    "position": 12,
    "diff": -344.0
  },
  {
    "driverNumber": "87",
    "driverName": "Oliver Bearman",
    "code": "BEA",
    "team": "Ferrari",
    "teamColor": "#E80020",
    "points": 39.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "GBR",
    "position": 13,
    "diff": -355.0
  },
  {
    "driverNumber": "30",
    "driverName": "Liam Lawson",
    "code": "LAW",
    "team": "Red Bull Racing",
    "teamColor": "#3671C6",
    "points": 38.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "NZL",
    "position": 14,
    "diff": -356.0
  },
  {
    "driverNumber": "31",
    "driverName": "Esteban Ocon",
    "code": "OCO",
    "team": "Ferrari",
    "teamColor": "#E80020",
    "points": 34.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "FRA",
    "position": 15,
    "diff": -360.0
  },
  {
    "driverNumber": "18",
    "driverName": "Lance Stroll",
    "code": "STR",
    "team": "Mercedes",
    "teamColor": "#27F4D2",
    "points": 29.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "CAN",
    "position": 16,
    "diff": -365.0
  },
  {
    "driverNumber": "22",
    "driverName": "Yuki Tsunoda",
    "code": "TSU",
    "team": "RB",
    "teamColor": "#6692FF",
    "points": 21.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "JPN",
    "position": 17,
    "diff": -373.0
  },
  {
    "driverNumber": "10",
    "driverName": "Pierre Gasly",
    "code": "GAS",
    "team": "Alpine",
    "teamColor": "#0093CC",
    "points": 20.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "FRA",
    "position": 18,
    "diff": -374.0
  },
  {
    "driverNumber": "5",
    "driverName": "Gabriel Bortoleto",
    "code": "BOR",
    "team": "Ferrari",
    "teamColor": "#E80020",
    "points": 19.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "BRA",
    "position": 19,
    "diff": -375.0
  },
  {
    "driverNumber": "7",
    "driverName": "Jack Doohan",
    "code": "DOO",
    "team": "Alpine",
    "teamColor": "#0093CC",
    "points": 0.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "AUS",
    "position": 20,
    "diff": -394.0
  },
  {
    "driverNumber": "43",
    "driverName": "Franco Colapinto",
    "code": "COL",
    "team": "Alpine",
    "teamColor": "#0093CC",
    "points": 0.0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "countryCode": "ARG",
    "position": 21,
    "diff": -394.0
  }
].map((d) => ({
  ...d,
  headshot: DRIVER_DETAILS_MAP[d.driverNumber]?.image,
  teamLogo: TEAM_ASSETS[d.team]?.logo
}));

export const SEASON_2025_CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
  {
    "team": "McLaren",
    "points": 775.0,
    "wins": 14,
    "podiums": 34,
    "color": "#FF8000",
    "drivers": [
      "Lando Norris",
      "Oscar Piastri"
    ],
    "position": 1,
    "diff": 0.0
  },
  {
    "team": "Mercedes",
    "points": 628.0,
    "wins": 2,
    "podiums": 14,
    "color": "#27F4D2",
    "drivers": [
      "Alexander Albon",
      "Carlos Sainz",
      "Fernando Alonso",
      "George Russell",
      "Kimi Antonelli",
      "Lance Stroll"
    ],
    "position": 2,
    "diff": -147.0
  },
  {
    "team": "Ferrari",
    "points": 503.0,
    "wins": 0,
    "podiums": 8,
    "color": "#E80020",
    "drivers": [
      "Charles Leclerc",
      "Esteban Ocon",
      "Gabriel Bortoleto",
      "Lewis Hamilton",
      "Nico Hulkenberg",
      "Oliver Bearman"
    ],
    "position": 3,
    "diff": -272.0
  },
  {
    "team": "Red Bull Racing",
    "points": 410.0,
    "wins": 8,
    "podiums": 15,
    "color": "#3671C6",
    "drivers": [
      "Liam Lawson",
      "Max Verstappen",
      "Yuki Tsunoda"
    ],
    "position": 4,
    "diff": -365.0
  },
  {
    "team": "RB",
    "points": 88.0,
    "wins": 0,
    "podiums": 1,
    "color": "#6692FF",
    "drivers": [
      "Isack Hadjar",
      "Liam Lawson",
      "Yuki Tsunoda"
    ],
    "position": 5,
    "diff": -687.0
  },
  {
    "team": "Alpine",
    "points": 20.0,
    "wins": 0,
    "podiums": 0,
    "color": "#0093CC",
    "drivers": [
      "Franco Colapinto",
      "Jack Doohan",
      "Pierre Gasly"
    ],
    "position": 6,
    "diff": -755.0
  }
].map((c) => ({
  ...c,
  logo: TEAM_ASSETS[c.team]?.logo,
  car: TEAM_ASSETS[c.team]?.car
}));
