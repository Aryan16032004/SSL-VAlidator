import {Router} from "express"
import { validateDomain } from "../Controller/user.controller.js"

const router =Router()

router.route("/domain").post(validateDomain)


export {router}