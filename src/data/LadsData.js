export default function getLadsData() {
 return [
  {
    id: 1,
    code: '1-0-1',
    siteIds: [1, 3, 4, 2],
    segmentIds: [1, 2, 3],
    serviceTime: {
      start: '07:00',
      end: '22:00',
    },
    headways: [
      {
        fromTime: '07:00',
        value: 20,
      },
      {
        fromTime: '09:00',
        value: 30,
      },
      {
        fromTime: '17:00',
        value: 20,
      },
      {
        fromTime: '20:00',
        value: 30,
      },
    ],
  },
  {
    id: 2,
    code: '1-0-2',
    siteIds: [2, 4, 1, 5, 3],
    segmentIds: [4, 5, 6, 7],
    serviceTime: {
      start: '06:00',
      end: '23:00',
    },
    headways: [
      {
        fromTime: '06:00',
        value: 20,
      },
      {
        fromTime: '07:00',
        value: 15,
      },
      {
        fromTime: '10:00',
        value: 20,
      },
      {
        fromTime: '18:00',
        value: 15,
      },
      {
        fromTime: '21:00',
        value: 20,
      },
    ],
  },
  {
    id: 3,
    code: '2-1-1',
    siteIds: [11, 4, 1, 5],
    segmentIds: [4, 5, 6],
    serviceTime: {
      start: '07:00',
      end: '22:00',
    },
    headways: [
      {
        fromTime: '07:00',
        value: 30,
      },
    ],
  },
 ];
}