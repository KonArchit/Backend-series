import {asyncHandler} from  '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import validator from "validator";

const registerUser = asyncHandler ( async(req, res) => {
     const {username, fullname, email, password} = req.body 
     console.log("username:", username)
     console.log("fullname:", fullname)
     console.log("email:", email)
     console.log("password:", password)

    // if (
    //     [username, fullname, email, password].some((field) => field?.trim() === "") 
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }

    // email validation check 
    const isValid = validator.isEmail(email);

     if (fullname === "") {
            throw new ApiError(400, "Fullname is required.")
     }else if (username === "") {
            throw new ApiError(400, "Username is required and should be unique.")
     }else if (email === "") {
            throw new ApiError(400, "Email address is required.")
    }else if (password === "") {
            throw new ApiError(400, "Password is required.")
    }
        
    if(!isValid){
        console.log("Email is inValid!")
    }

    const alreadyExist = User.findOne({
        $or: [{ username },{ email }]
    })

    // console.log(alreadyExist)

    if (alreadyExist) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // console.log(avatarLocalPath) -> output(undefined)

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.tolowercase(),
        email,
        password
    })

    const userCreated = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!userCreated) {
        throw new ApiError(500, "something went wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(200, userCreated, "User registered successfully")
    )
    
})

export {registerUser}