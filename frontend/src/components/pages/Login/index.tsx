import { LoginForm } from "./LoginForm";

export function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-32 h-32 mx-auto flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <img src="/assets/logo-dummy.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
      </div>
      <LoginForm />
    </div>
  );
}
