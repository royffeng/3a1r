import React, { useState } from "react";
import {RxEyeClosed, RxEyeNone} from "react-icons/rx"

const Input = ({ values, value, setData, placeholder, name, type, label }) => {

  const [toggle, setToggle] = useState(false)
  const [password, setPassword] = useState("password")

  const handlePassword = (state) => {
    if (state) {
      setPassword("text")
    } else {
      setPassword ("password")
    }
    setToggle(!toggle)
  }

  return (
    <div className="flex justify-center items-start flex-col font-lexend w-full my-4">
      <p className="text-2xl mb-2">{label}</p>
      <div className = "rounded-full border-2 bg-white border-black px-4 py-2 text-2xl w-full flex">
      <input
        name={name}
        type={(name === "password" || name === "confirmPassword") ? password : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          setData({ ...values, [e.target.name]: e.target.value })
        }
        className="outline-none w-full"
      />
      {
        (name === "password" || name === "confirmPassword") && toggle && <RxEyeNone onClick = {() => handlePassword(false)} />
      }
      {
        (name === "password" || name === "confirmPassword") && !toggle && <RxEyeClosed onClick = {() => handlePassword(true)} />
      }
      </div>
      
    </div>
  );
};

export default Input;
