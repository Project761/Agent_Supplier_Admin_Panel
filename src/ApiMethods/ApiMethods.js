
import axios from "axios";
import { el } from "date-fns/locale/el";


export const fetchDataTesting = async (URL) => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const config = { headers: { Authorization: `Bearer ` + auth.token } };
    try {
        const api = `${process.env.REACT_APP_Base_URL}${URL}`;
        const res = await axios.get(api, config);
        const { data } = res;
    } catch (error) {
        const msg = error.response;
        console.log(error);
    }
};

export const fetchData = async (URL) => {
    try {
        const res = await axios.get(URL)
    } catch (error) {
        console.error(error)
    }
};

export const getPostData = async (url, postData) => {
    try {
        const res = await axios.post(url, postData);
        const { data } = res
        const parseData = JSON.parse(data?.data)
        return parseData?.Table
    } catch (error) {
        console.error(error)
    }
}

export const AddDeleteUpadate = async (url, postData) => {
    try {
        const res = await axios.post(url, postData);
        if (res.code == "ERR_BAD_REQUEST") {
            return res
        } else {
            return res.data;
        }
    } catch (error) {
        console.error(error)
    }
}

export const getData = async (url, postData) => {
    try {
        const res = await axios.get(url, postData);
        const { data } = res
        const parseData = JSON.parse(data?.data)
        return parseData?.Table
    } catch (error) {
        console.error(error)
    }
}

export const Comman_changeArrayFormat = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
      const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], id: sponsor[col3] })
      )
      return result
    } else {
      const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code] })
      )
      return result
    }
  }
  

