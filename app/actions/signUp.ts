"use server";

import apiClient from "../lib/apiClient";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../lib/helperFunctions";

interface Errors {
  error?: string;
  success?: boolean;
}

export default async function signup(
  prevState: Errors,
  formData: FormData,
): Promise<Errors> {
  // Get and Validate all fields
  const firstname = formData.get("firstname") as string;
  const surname = formData.get("surname") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const errors: Errors = {};

  if (!firstname || !surname || !password)
    errors.error = "All fields are required";
  if (!isValidName(firstname, surname))
    errors.error =
      "Both firstname and surname should be at least two letters and not contain any special character";
  if (!isValidEmail(email)) errors.error = "Kindly enter a valid email";
  const fullname = `${firstname} ${surname}`;
  if (!isValidPassword(password))
    errors.error =
      "Password should be at least 8 characters long and contain at least 1 special character and 1 number";

  // Return early if validation fails
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  try {
    await apiClient.register({
      name: fullname,
      email,
      password,
    });

    return { success: true }; 
  } catch (err) {
    console.error("Registeration error ", err);
    return {
      error: err instanceof Error ? err.message : "Registeration failed",
      success: false,
    };
    
  }
  
}
