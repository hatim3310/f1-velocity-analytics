import { DriverStanding, ConstructorStanding } from '../types';
import { TEAM_ASSETS } from '../constants';

export const SEASON_2026_DRIVER_STANDINGS: DriverStanding[] = [
  {
    "driverNumber": "12",
    "driverName": "Kimi ANTONELLI",
    "code": "ANT",
    "team": "Mercedes",
    "teamColor": "#00D7B6",
    "points": 309,
    "wins": 8,
    "podiums": 14,
    "fastestLaps": 0,
    "headshot": "/images/drivers/antonelli.png",
    "countryCode": null,
    "position": 1,
    "diff": 0
  },
  {
    "driverNumber": "63",
    "driverName": "George RUSSELL",
    "code": "RUS",
    "team": "Mercedes",
    "teamColor": "#00D7B6",
    "points": 204,
    "wins": 3,
    "podiums": 8,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 2,
    "diff": -105
  },
  {
    "driverNumber": "3",
    "driverName": "Max VERSTAPPEN",
    "code": "VER",
    "team": "Red Bull Racing",
    "teamColor": "#4781D7",
    "points": 201,
    "wins": 2,
    "podiums": 9,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 3,
    "diff": -108
  },
  {
    "driverNumber": "44",
    "driverName": "Lewis HAMILTON",
    "code": "HAM",
    "team": "Ferrari",
    "teamColor": "#ED1131",
    "points": 200,
    "wins": 1,
    "podiums": 6,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 4,
    "diff": -109
  },
  {
    "driverNumber": "16",
    "driverName": "Charles LECLERC",
    "code": "LEC",
    "team": "Ferrari",
    "teamColor": "#ED1131",
    "points": 185,
    "wins": 1,
    "podiums": 5,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 5,
    "diff": -124
  },
  {
    "driverNumber": "1",
    "driverName": "Lando NORRIS",
    "code": "NOR",
    "team": "McLaren",
    "teamColor": "#F47600",
    "points": 168,
    "wins": 2,
    "podiums": 5,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 6,
    "diff": -141
  },
  {
    "driverNumber": "81",
    "driverName": "Oscar PIASTRI",
    "code": "PIA",
    "team": "McLaren",
    "teamColor": "#F47600",
    "points": 117,
    "wins": 0,
    "podiums": 2,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 7,
    "diff": -192
  },
  {
    "driverNumber": "6",
    "driverName": "Isack HADJAR",
    "code": "HAD",
    "team": "Red Bull Racing",
    "teamColor": "#4781D7",
    "points": 97,
    "wins": 0,
    "podiums": 2,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 8,
    "diff": -212
  },
  {
    "driverNumber": "30",
    "driverName": "Liam LAWSON",
    "code": "LAW",
    "team": "Racing Bulls",
    "teamColor": "#6C98FF",
    "points": 66,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 9,
    "diff": -243
  },
  {
    "driverNumber": "10",
    "driverName": "Pierre GASLY",
    "code": "GAS",
    "team": "Alpine",
    "teamColor": "#00A1E8",
    "points": 39,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 10,
    "diff": -270
  },
  {
    "driverNumber": "41",
    "driverName": "Arvid LINDBLAD",
    "code": "LIN",
    "team": "Racing Bulls",
    "teamColor": "#6C98FF",
    "points": 36,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "/images/drivers/lindblad.png",
    "countryCode": null,
    "position": 11,
    "diff": -273
  },
  {
    "driverNumber": "43",
    "driverName": "Franco COLAPINTO",
    "code": "COL",
    "team": "Alpine",
    "teamColor": "#00A1E8",
    "points": 28,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 12,
    "diff": -281
  },
  {
    "driverNumber": "87",
    "driverName": "Oliver BEARMAN",
    "code": "BEA",
    "team": "Haas F1 Team",
    "teamColor": "#9C9FA2",
    "points": 19,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 13,
    "diff": -290
  },
  {
    "driverNumber": "27",
    "driverName": "Nico HULKENBERG",
    "code": "HUL",
    "team": "Audi",
    "teamColor": "#F50537",
    "points": 11,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 14,
    "diff": -298
  },
  {
    "driverNumber": "5",
    "driverName": "Gabriel BORTOLETO",
    "code": "BOR",
    "team": "Audi",
    "teamColor": "#F50537",
    "points": 10,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 15,
    "diff": -299
  },
  {
    "driverNumber": "31",
    "driverName": "Esteban OCON",
    "code": "OCO",
    "team": "Haas F1 Team",
    "teamColor": "#9C9FA2",
    "points": 7,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 16,
    "diff": -302
  },
  {
    "driverNumber": "55",
    "driverName": "Carlos SAINZ",
    "code": "SAI",
    "team": "Williams",
    "teamColor": "#1868DB",
    "points": 7,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 17,
    "diff": -302
  },
  {
    "driverNumber": "14",
    "driverName": "Fernando ALONSO",
    "code": "ALO",
    "team": "Aston Martin",
    "teamColor": "#229971",
    "points": 6,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 18,
    "diff": -303
  },
  {
    "driverNumber": "23",
    "driverName": "Alexander ALBON",
    "code": "ALB",
    "team": "Williams",
    "teamColor": "#1868DB",
    "points": 5,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 19,
    "diff": -304
  },
  {
    "driverNumber": "11",
    "driverName": "Sergio PEREZ",
    "code": "PER",
    "team": "Cadillac",
    "teamColor": "#909090",
    "points": 1,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 20,
    "diff": -308
  },
  {
    "driverNumber": "22",
    "driverName": "Yuki TSUNODA",
    "code": "TSU",
    "team": "Racing Bulls",
    "teamColor": "#6C98FF",
    "points": 1,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 21,
    "diff": -308
  },
  {
    "driverNumber": "18",
    "driverName": "Lance STROLL",
    "code": "STR",
    "team": "Aston Martin",
    "teamColor": "#229971",
    "points": 0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 22,
    "diff": -309
  },
  {
    "driverNumber": "77",
    "driverName": "Valtteri BOTTAS",
    "code": "BOT",
    "team": "Cadillac",
    "teamColor": "#909090",
    "points": 0,
    "wins": 0,
    "podiums": 0,
    "fastestLaps": 0,
    "headshot": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/1col/image.png",
    "countryCode": null,
    "position": 23,
    "diff": -309
  }
].map(d => ({
  ...d,
  teamLogo: TEAM_ASSETS[d.team]?.logo
}));

export const SEASON_2026_CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
  {
    "team": "Mercedes",
    "points": 513,
    "wins": 11,
    "podiums": 22,
    "color": "#00D7B6",
    "drivers": [
      "George RUSSELL",
      "Kimi ANTONELLI"
    ],
    "position": 1,
    "diff": 0
  },
  {
    "team": "Ferrari",
    "points": 385,
    "wins": 2,
    "podiums": 11,
    "color": "#ED1131",
    "drivers": [
      "Charles LECLERC",
      "Lewis HAMILTON"
    ],
    "position": 2,
    "diff": -128
  },
  {
    "team": "Red Bull Racing",
    "points": 312,
    "wins": 2,
    "podiums": 11,
    "color": "#4781D7",
    "drivers": [
      "Isack HADJAR",
      "Liam LAWSON",
      "Max VERSTAPPEN"
    ],
    "position": 3,
    "diff": -201
  },
  {
    "team": "McLaren",
    "points": 285,
    "wins": 2,
    "podiums": 7,
    "color": "#F47600",
    "drivers": [
      "Lando NORRIS",
      "Oscar PIASTRI"
    ],
    "position": 4,
    "diff": -228
  },
  {
    "team": "Racing Bulls",
    "points": 89,
    "wins": 0,
    "podiums": 0,
    "color": "#6C98FF",
    "drivers": [
      "Arvid LINDBLAD",
      "Liam LAWSON",
      "Yuki TSUNODA"
    ],
    "position": 5,
    "diff": -424
  },
  {
    "team": "Alpine",
    "points": 67,
    "wins": 0,
    "podiums": 0,
    "color": "#00A1E8",
    "drivers": [
      "Franco COLAPINTO",
      "Pierre GASLY"
    ],
    "position": 6,
    "diff": -446
  },
  {
    "team": "Haas F1 Team",
    "points": 26,
    "wins": 0,
    "podiums": 0,
    "color": "#9C9FA2",
    "drivers": [
      "Esteban OCON",
      "Oliver BEARMAN"
    ],
    "position": 7,
    "diff": -487
  },
  {
    "team": "Audi",
    "points": 21,
    "wins": 0,
    "podiums": 0,
    "color": "#F50537",
    "drivers": [
      "Gabriel BORTOLETO",
      "Nico HULKENBERG"
    ],
    "position": 8,
    "diff": -492
  },
  {
    "team": "Williams",
    "points": 12,
    "wins": 0,
    "podiums": 0,
    "color": "#1868DB",
    "drivers": [
      "Alexander ALBON",
      "Carlos SAINZ"
    ],
    "position": 9,
    "diff": -501
  },
  {
    "team": "Aston Martin",
    "points": 6,
    "wins": 0,
    "podiums": 0,
    "color": "#229971",
    "drivers": [
      "Fernando ALONSO",
      "Lance STROLL"
    ],
    "position": 10,
    "diff": -507
  },
  {
    "team": "Cadillac",
    "points": 1,
    "wins": 0,
    "podiums": 0,
    "color": "#909090",
    "drivers": [
      "Sergio PEREZ",
      "Valtteri BOTTAS"
    ],
    "position": 11,
    "diff": -512
  }
].map(c => ({
  ...c,
  logo: TEAM_ASSETS[c.team]?.logo,
  car: TEAM_ASSETS[c.team]?.car
}));
