export default function getRuntimesData() {
  return [
    {
      id: 1,
      ladId: 1,
      departures: ['07:00', '07:30', '08:00'],
      runtimes: [
        {
          depth: 1,
          trips: [
            {
              tripId: 1,
              departure: '07:03',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 13,
                },
                {
                  segmentId: 2,
                  segmentTime: 9,
                },
                {
                  segmentId: 3,
                  segmentTime: 17,
                },
              ],
            },
            {
              tripId: 2,
              departure: '07:29',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 14,
                },
                {
                  segmentId: 2,
                  segmentTime: 10,
                },
                {
                  segmentId: 3,
                  segmentTime: 16,
                },
              ],
            },
            {
              tripId: 3,
              departure: '08:02',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 15,
                },
                {
                  segmentId: 2,
                  segmentTime: 11,
                },
                {
                  segmentId: 3,
                  segmentTime: 17,
                },
              ],
            },
          ],
        },
        {
          depth: 2,
          trips: [
            {
              tripId: 1,
              departure: '07:02',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 12,
                },
                {
                  segmentId: 2,
                  segmentTime: 9,
                },
                {
                  segmentId: 3,
                  segmentTime: 16,
                },
              ],
            },
            {
              tripId: 2,
              departure: '07:30',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 14,
                },
                {
                  segmentId: 2,
                  segmentTime: 11,
                },
                {
                  segmentId: 3,
                  segmentTime: 17,
                },
              ],
            },
            {
              tripId: 3,
              departure: '08:01',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 16,
                },
                {
                  segmentId: 2,
                  segmentTime: 11,
                },
                {
                  segmentId: 3,
                  segmentTime: 18,
                },
              ],
            },
          ],
        },
        {
          depth: 3,
          trips: [
            {
              tripId: 1,
              departure: '07:01',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 11,
                },
                {
                  segmentId: 2,
                  segmentTime: 10,
                },
                {
                  segmentId: 3,
                  segmentTime: 15,
                },
              ],
            },
            {
              tripId: 2,
              departure: '07:33',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 15,
                },
                {
                  segmentId: 2,
                  segmentTime: 10,
                },
                {
                  segmentId: 3,
                  segmentTime: 15,
                },
              ],
            },
            {
              tripId: 3,
              departure: '08:02',
              segments: [
                {
                  segmentId: 1,
                  segmentTime: 17,
                },
                {
                  segmentId: 2,
                  segmentTime: 12,
                },
                {
                  segmentId: 3,
                  segmentTime: 17,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
