const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.get('/test/uuid', (req, res) => {
  const uuid = uuidv4();

  res.send({ random_uuid: uuid });
});

app.post('/integrations/montri/webhook', (req, res) => {
  console.log('/integrations/montri/webhook');

  res.status(200);
});

app.get('/maps/api/distancematrix/json(.*)', (req, res) => {
  console.log('/maps/api/distancematrix/json(.*)');

  res.send({
    destination_addresses: ["Phloen Chit, Khwaeng Lumphini, Pathum Wan, Krung Thep Maha Nakhon 123456, Thailand"],
    origin_addresses: ["888, 3 Phloen Chit Rd, Khwaeng Lumphini, Pathum Wan, Krung Thep Maha Nakhon 123456, Thailand"],
    rows: [{
      elements: [{
        distance: {
          text: "0.1 km", "value": 103
        },
        duration: { text: "1 min", value: 48 },
        duration_in_traffic: { text: "1 min", value: 61 },
        status: "OK"
      }
      ]
    }
    ],
    status: "OK"
  });
});

app.post('/broadcast/all', (req, res) => {
  console.log('/broadcast/all');

  res.send({
    data: {
      type: "shuttle_bus_position.updated",
      data: {
        stations: [{
          latitude: "13.74303262590384",
          longitude: "100.5488396976434",
          name: "Phloen Chit BTS",
          shuttle_bus_detail: [{
            origin: {
              latitude: "13.742791",
              longitude: "100.549633"
            },
            course: "291",
            destination: {
              latitude: "13.74303262590384",
              longitude: "100.5488396976434"
            },
            detail: {
              id: "T015820732034",
              name: ""
            },
            duration: {
              text: "1 min",
              value: 48
            },
            duration_in_traffic: {
              text: "1 min",
              value: 61
            },
            distance: {
              text: "0.1 km",
              value: 103
            }
          }
          ],
          flag: {
            name: ["Park Venture"]
          },
          time: []
        }, {
          latitude: "13.725381",
          longitude: "100.548059",
          name: "Parade Drop-off",
          shuttle_bus_detail: [],
          flag: {
            name: [
              "Test", "Parade", "MRT Lumpini"
            ]
          },
          time: []
        }, {
          latitude: "13.727391",
          longitude: "100.545240",
          name: "The Storeys Drop-off",
          shuttle_bus_detail: [],
          flag: {
            name: ["Tower 4", "Parade", "MRT Lumpini"]
          },
          time: [
            { time: "07:00" },
            { time: "07:15" },
            { time: "07:30" },
            { time: "07:45" },
            { time: "08:00" },
            { time: "08:15" },
            { time: "08:30" },
            { time: "08:45" },
            { time: "09:00" },
            { time: "09:15" },
            { time: "09:30" },
            { time: "09:45" },
            { time: "10:00" },
            { time: "10:15" },
            { time: "10:30" },
            { time: "10:45" },
            { time: "11:00" },
            { time: "11:15" },
            { time: "11:30" },
            { time: "11:45" },
            { time: "12:00" },
            { time: "12:15" },
            { time: "12:30" },
            { time: "12:45" },
            { time: "13:00" },
            { time: "13:15" },
            { time: "13:30" },
            { time: "13:45" },
            { time: "14:00" },
            { time: "14:15" },
            { time: "14:30" },
            { time: "14:45" },
            { time: "15:00" },
            { time: "15:15" },
            { time: "15:30" },
            { time: "15:45" },
            { time: "16:00" },
            { time: "16:15" },
            { time: "16:30" },
            { time: "16:45" },
            { time: "17:00" },
            { time: "17:15" },
            { time: "17:30" },
            { time: "17:45" },
            { time: "18:00" },
            { time: "18:15" },
            { time: "18:30" },
            { time: "18:45" },
            { time: "19:00" },
            { time: "19:15" },
            { time: "19:30" },
            { time: "19:45" },
            { time: "20:00" },
            { time: "20:15" },
            { time: "20:30" },
            { time: "20:45" },
            { time: "21:00" },
            { time: "21:15" },
            { time: "21:30" },
            { time: "21:45" },
            { time: "22:00" },
            { time: "22:30" },
            { time: "22:45" },
            { time: "23:00" }]
        }]
      }
    }
  });
});

app.post('/broadcast', (req, res) => {
  console.log('/broadcast');

  res.send({
    data: {
      message: "wiremock boardcast response"
    }
  });
});

app.post('/obk/api/oauth2/token', (req, res) => {
  console.log('/obk/api/oauth2/token');

  const uuid = uuidv4();

  res.send({
    username: uuid,
    wiremock: "xxx"
  });
});

app.post('/obk/api/v1/customer/kc/user', (req, res) => {
  console.log('/obk/api/v1/customer/kc/user');

  const randomNumber = Math.floor(Math.random() * 99999) + 1;
  const formattedNumber = randomNumber.toString().padStart(5, '0');

  res.send({
    username: `ex${formattedNumber}`,
  });
});

app.post('/obk/api/v1/resident/register-new-tenant', (req, res) => {
  console.log('/obk/api/v1/resident/register-new-tenant');

  res.send({
    data: {
      syncToMtel: true,
      syncToBim: true
    }
  });
});

app.post('/obk/api/v1/mt/parking/getParkingDetailByPersonId', (req, res) => {
  console.log('/obk/api/v1/mt/parking/getParkingDetailByPersonId');

  res.send({ "status": 0, "message": "Success!", "data": [{ "status": null, "message": "คำนวณเรียบร้อยแล้ว", "exeption": null, "logId": "16022024163745007", "ticketNo": "8c170291-b5a5-499c-ad4d-2a530650bdec", "ticketUid": "8c170291-b5a5-499c-ad4d-2a530650bdec", "plateNo": "", "exitStatus": 0, "terminalInId": 7, "terminalInName": "ENT07", "memberTypeId": 0, "memberTypeName": "", "vehicleTypeId": 0, "vehicleTypeName": "CAR", "entryDateTime": "2024-02-16 16:37:45", "logDateTime": "2024-09-16 15:14:11", "isCardLost": false, "parkHH": 5110, "parkMM": 36, "rateHH": 5111, "freeHH": 0, "rateCode": "0", "rateDetailTH": "เก็บเงินคนขับ 50 บาท หลังจากนั้น เก็บเงินคนขับ 50 บาท", "rateDetailEN": "50 baht  After that 50 baht ", "tenantId": "1", "tenantName": "ABC Mockup Company", "subTotal": 255350, "discount": 0, "parkFee": 255550, "cardLostFine": 0, "overNightFine": 212000, "total": 467550, "isInv": false, "invRateHH": 0, "invFee": 0, "isPayAtKiosk": false, "lastDateTimePaymentAtKiosk": "", "payAtKioskAll": 0, "timeUsedInMinute": 0, "durationInMinute": 0, "remainInMinute": 0 }], "count": 0 });
});

app.post('/api/Login/ForceStatusLogin', (req, res) => {
  console.log('/api/Login/ForceStatusLogin');

  res.send({});
});

app.post('/api/Login/Login', (req, res) => {
  console.log('/api/Login');

  res.send({ "data": { "user_ID": 1000001, "user_Name": "user01", "firstName": "firstname01", "lastName": "lastname01", "department": null, "position": null, "note": null, "active": true, "isLogIn": true, "token": "token1", "role_ID": 1 } });
});

app.post('/api/PreRegister/invitePreRegister', (req, res) => {
  const uuid = uuidv4();
  console.log(`invitePreRegister: uid: ${uuid}`);

  res.send({ "data": { "inviteID": uuid } });
});

app.post('/api/AuthorizeFloor/getCallLift', (req, res) => {
  console.log('/api/AuthorizeFloor/getCallLift');

  res.send({
    data: {
      personID: "81b9cd31-1b85-4e8b-8cc9-e52724acecd0",
      liftName: "liftname01",
      floorID: 1,
      floorName: "015",
    }
  });
});

app.post('/api/login/CheckRedemptionStatusByEmail', (req, res) => {
  console.log('/api/login/CheckRedemptionStatusByEmail');

  res.send({
    data: {
      departmentId: "81b9cd31-1b85-4e8b-8cc9-e52724acecd0",
      tenantId: "81b9cd31-1b85-4e8b-8cc9-e52724acecd0",
    }
  });
});

app.get('/', (req, res) => {
  res.send('Hello World')
});

app.listen(process.env.SERVER_PORT);
