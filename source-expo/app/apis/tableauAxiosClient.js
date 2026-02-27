import axios from 'axios';


const tableauApi = axios.create({
  baseURL: 'https://reports.dcscustoms.com.tr/api/3.25/',
});

export default tableauApi;