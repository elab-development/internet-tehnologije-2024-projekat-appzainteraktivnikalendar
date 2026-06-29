import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 30, // 30 virtual users
  duration: '30s',
};

export default function () {
  const url = 'http://127.0.0.1:8000/api/patient/appointments';

  const payload = JSON.stringify({
    doctor_id: 1,
    start_time: '2026-07-01 10:00'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 79|PKon44blEnxmpFU4F4pGcFt66BDgEsE3NVPg4yZd33d8beb5'
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201 or 400': (r) => r.status === 201 || r.status === 400,
  });
}