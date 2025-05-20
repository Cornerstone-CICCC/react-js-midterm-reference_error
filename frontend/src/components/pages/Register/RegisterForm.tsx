import { registerUser } from "@/app/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEnvelope, FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegPaperPlane } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { LuLock } from "react-icons/lu";
import type { z } from "zod";
import { registerUserSchema } from "./validations/register-user";

export function RegisterForm() {
  type InputSchema = z.infer<typeof registerUserSchema>;
  type OutputSchema = z.output<typeof registerUserSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<InputSchema>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (data: OutputSchema) => {
    try {
      const result = await registerUser(data);
      if (result?.error) {
        setError("root.serverError", {
          type: "server",
          message: result.error,
        });
      } else if (result?.success) {
        reset();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setError("root.serverError", {
        type: "server",
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRegEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                {...register("email")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="example@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCircleUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nickname"
                type="text"
                autoComplete="nickname"
                required
                {...register("nickname")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Your Nickname"
              />
            </div>
            {errors.nickname && (
              <p className="mt-2 text-sm text-red-600" id="nickname-error">
                {errors.nickname.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                {...register("password")}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      togglePasswordVisibility();
                    }
                  }}
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                >
                  {!showPassword ? (
                    <FaRegEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaRegEye className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600" id="password-error">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                {...register("confirmPassword")}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      togglePasswordVisibility();
                    }
                  }}
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                >
                  {!showPassword ? (
                    <FaRegEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaRegEye className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600" id="password-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <button
              onClick={handleSubmit(handleRegister)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <FaRegPaperPlane className="animate-bounce mr-2 w-4 h-4" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Sign up"
              )}
            </button>
            {errors.root?.serverError && (
              <p className="mt-2 text-sm text-red-600" id="server-error">
                {errors.root.serverError.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-orange-500 cursor-pointer"
              href={"/login"}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
