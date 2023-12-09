import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom';
import { Urlconstant } from '../constant/Urlconstant';

function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = "#";
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }
  
  function stringAvatar(name) {
    let avatarText = "";
  
    if (name.includes(" ")) {
      const [firstName, lastName] = name.split(" ");
      avatarText = `${firstName[0]}${lastName[0]}`;
    } else {
      avatarText = name[0];
    }
  
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: avatarText,
    };
}
const CompanyProfile=()=> {
    const { id } = useParams();
    const {companyDetails,setCompanyDetails}=React.useState("");

    const fetchData=()=>{
            axios.get(Urlconstant.url+`api/getdetailsbyid?companyId=${id}`)
            .then(response=>{
                console.log(response.data);
                setCompanyDetails(response.data);
            })
    }

    React.useEffect(()=>{
        fetchData();
    },[id]);


  return (
    <div>CompanyProfile
        <h2>Company Profile</h2>
        <h2>Company Profile</h2>
        <h2>{id}</h2>
    </div>
  )
}
export default CompanyProfile;

