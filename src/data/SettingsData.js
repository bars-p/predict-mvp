export default function getSettingsData() {
  return {
    defaultSpeed: 11,
    dayPeriodCoefficients: [
      {
        fromTime: '05:00',
        value: 0.9,
      },
      {
        fromTime: '07:00',
        value: 0.8,
      },
      {
        fromTime: '10:00',
        value: 0.9,
      },
      {
        fromTime: '16:00',
        value: 0.8,
      },
      {
        fromTime: '17:00',
        value: 0.7,
      },
      {
        fromTime: '19:00',
        value: 0.8,
      },
      {
        fromTime: '21:00',
        value: 0.9,
      },
      {
        fromTime: '22:00',
        value: 1,
      },
    ],
    departureShift: {
      before: -2,
      after: 3,
    },
    tripTimeVariationPercent: 10,
  };
}
