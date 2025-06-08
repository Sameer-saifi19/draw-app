import express from "express";
import { z } from "zod";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { middleware } from "./middleware";
import { JWT_SECRET } from '@repo/backend-common/config'


const app = express();
app.use(express.json())

app.post("/signup", async function (req, res) {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
  });

  const safeParseData = requiredBody.safeParse(req.body);
  
  if(!safeParseData.success){
    res.json({
        message: "Incorrect input format"
    })
    return;
  }

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 5)

  try {
    await userModel.create({
        email: email,
        password: hashedPassword
    })

    res.json({
        message: "signup success"
    })

  }catch(error){
    res.json({
        message:"something went wrong"
    })
  }
});


app.post('/signin',async function(req,res){
    const requiredBody = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
  });

  const safeParseData = requiredBody.safeParse(req.body);

  if (!safeParseData.success) {
    res.json({
      message: "Incorrect Input Format",
      Error: safeParseData.error,
    });
    return;
  }

  const { email, password } = req.body

  try{
    const user = await userModel.findOne({email})


    if(!user){
        res.status(401).json({
            message: "user not found"
        })
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        res.json({
            message: "Incorrect Credentials"
        })
    }else{
        const token = jwt.sign({id: user._id}, JWT_SECRET)
        res.json({
            token:token,
            message: "sign in successful"
        })
    }
  }
  catch(error){
    res.json({
        message: "something went wrong"
    })
  }

})

app.post('/create-room',middleware, function(req,res){
    // db call

    res.json({
        roomId: 123
    })
})

app.listen(3001);
