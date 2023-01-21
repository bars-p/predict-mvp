export default function getConfigData() {
    return {
      defaultSpeed: 10,
      dayPeriodCoefficients: [
        {
          fromTime: '07:00',
          value: 0.9,
        },
        {
          fromTime: '09:00',
          value: 0.8,
        },
        {
          fromTime: '12:00',
          value: 0.9,
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
    };
   }