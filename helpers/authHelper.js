import bcrypt from 'bcrypt';

export const hashpassword = async (password)=>{
   try {
    const saltrounds=11;
     const hashedpassword=await bcrypt.hash(password,saltrounds);
     return hashedpassword
   } catch (error) {
     console.log(error)
   }
};

export const comparepassword = async(password,hashpassword)=>{
    return bcrypt.compare(password,hashpassword);
};