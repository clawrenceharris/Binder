import { db } from "../../Firebase/firebase";
import { USERS } from "../constants";



export const setUsers = data => dispatch => dispatch({ data, type: USERS })
