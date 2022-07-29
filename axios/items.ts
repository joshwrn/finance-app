import axios from 'axios'

export const getItemCount = async (id: string) => {
  const response = await axios.get(`/api/item/count?id=${id}`)
  return response.data
}
