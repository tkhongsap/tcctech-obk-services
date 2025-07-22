"use client";

import AuthLoginPost from "@/services/AuthLoginPost";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import LoadingDefaultPage from "@/components/LoadingDefaultPage";

interface IFormInput {
  email: string;
  password: string;
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function Login() {
  const [loginError, setLoginError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
  });

  async function submit(data: IFormInput) {
    setLoginLoading(true);
    const [error, rdata] = (await AuthLoginPost(data, "/cms/home")) || [
      null,
      null,
    ];
    console.log([error, rdata]);
    setLoginError(!!error);
    if (error) {
      setLoginLoading(false);
    }
  }

  const InputErrorTempl = ({ text }: { text: string }) => {
    return <div className="text-red-600">{text}</div>;
  };

  if (loginLoading || loginSuccess) {
    return <LoadingDefaultPage />;
  }

  return (
    <div className="text-gray-600 h-screen bg-white flex flex-col space-y-10 justify-center items-center">
      <div className="bg-white w-full max-w-sm rounded p-5">
        <div className="text">
          <h1 className="text-3xl font-medium">Welcome</h1>
        </div>
        <p className="text-sm mt-2">Sign in to your account</p>

        <div className="text-red-600 mt-5">
          {loginError && "Fail to login. Please check you infomation"}
        </div>

        <form onSubmit={handleSubmit((d) => submit(d))} className="mt-4">
          <div className="space-y-5">
            <div>
              <input
                {...register("email")}
                type="text"
                name="email"
                className="w-full h-12 border border-gray-400 rounded px-3"
                placeholder="Email"
              />

              {errors.email?.message && (
                <InputErrorTempl text={errors.email?.message} />
              )}
            </div>
            <div>
              <input
                {...register("password")}
                type="password"
                className="w-full h-12 border border-gray-400 rounded px-3"
                placeholder="Password"
              />
              {errors.password?.message && (
                <InputErrorTempl text={errors.password?.message} />
              )}
            </div>
            {/* <div className="w-full flex items-center border border-gray-800 rounded px-3">
        <input type="password" className="w-4/5 h-12" placeholder="Password" />
        <span className="text-blue-700 hover:bg-blue-400 rounded-md px-3">Show</span>
      </div> */}

            {/* <div className="">
        <a href="#!" className="font-medium text-blue-900 hover:bg-blue-300 rounded-md p-2">Forgot Password ?</a>
      </div> */}
          </div>

          <button className="mt-8 text-center w-full bg-blue-900 rounded-md text-white py-3 font-medium">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
