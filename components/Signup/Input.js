import React from "react";

const Input = ({ values, value, setData, placeholder, name, type, label }) => {
  return (
    <div className="flex justify-center items-start flex-col font-lexend w-full my-4">
      <p className="text-2xl mb-2">{label}</p>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          setData({ ...values, [e.target.name]: e.target.value })
        }
        className="outline-none rounded-full border-2 border-black px-4 py-2 text-2xl w-full"
      />
    </div>
  );
};

export default Input;
