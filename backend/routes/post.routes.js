import express from "express"   
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { comment, getAllPosts, like, save, uploadPost } from "../controllers/post.controller.js";

const postRouter=express.Router();

postRouter.post("/upload",isAuth,upload.single("media"),uploadPost)
postRouter.get("/getAll",isAuth,getAllPosts)
postRouter.get("/like/:postId",isAuth,like)
postRouter.post("/comment/:postId",isAuth,comment) 
postRouter.get("/saved/:postId",isAuth,save) 

//////--Note->---- req.file hume upload.single likhne se mil jayega-----////////

export default postRouter;