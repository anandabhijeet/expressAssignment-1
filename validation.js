const regex = {
    email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/,
    name: /^[a-z A-Z]{2,30}/,
    // phone: /^\d{10}$/g,
  }; 

  const emailValidator = (email) =>{
      let validity = regex.email.test(email.trim());
      return validity; 
  }

  const passwordValidator = (password) =>{
      return regex.password.test(password);
  }

  const nameValidator = (name)=>{
      return regex.name.test(name);
  }

//   const phoneValidator = (phone)=>{
//       return regex.name.test(phone);
//   }

  module.exports ={
      emailValidator,
      passwordValidator,
      nameValidator,
    //   phoneValidator
  }