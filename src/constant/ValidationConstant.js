 

export const validateEmail=(email)=>{
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
}

export const validateContactNumber=(phoneNumber)=>{
       const phoneNumberRegex=  /^\d{10}$/;
       return phoneNumberRegex.test(phoneNumber);
}