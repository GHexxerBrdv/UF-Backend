import axios from 'axios'

const API_URL = 'http://uf-alb-861629580.ap-south-1.elb.amazonaws.com'
export const uploadFile = async (data)=>{
    try {
       let response=await axios.post(`${API_URL}/upload`,data);
       return response.data;
    } catch (error) {
        console.error('Error whlie calling the api',error.message);
    }
}

