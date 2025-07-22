import axios from 'axios'

export async function getExternalCameraList(): Promise<string[]> {
  const res = await axios.get('/api/external-camera-list')

  return res.data
}
