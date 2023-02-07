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
      before: -5,
      after: 5,
    },
    tripTimeVariationPercent: 20,
    percentile: {
      low: 20,
      high: 80,
    },
    layover: {
      default: 6,
      minimum: 2,
    },
  };
}
