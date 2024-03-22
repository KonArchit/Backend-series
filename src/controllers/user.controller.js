import {asyncHandler} from  '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import validator from "validator";

const registerUser = asyncHandler ( async(req, res) => {
     const {username, fullName, email, password} = req.body 
     console.log("username:", username)
     console.log("fullName:", fullName)
     console.log("email:", email)
     console.log("password:", password)
     // console.log(req.body) -> return object
     
    // if (
    //     [username, fullname, email, password].some((field) => field?.trim() === "") 
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }
    
    // email validation check 
    const isValid = validator.isEmail(email);

     if (fullName === "") {
            throw new ApiError(400, "FullName is required.")
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

    const alreadyExist = await User.findOne({
        $or: [{ username },{ email }]
    })

    // console.log(alreadyExist)

    if (alreadyExist) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log(avatarLocalPath) -> output(path of avatar file)

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const userCreated = await User.findById(user._id).select(
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