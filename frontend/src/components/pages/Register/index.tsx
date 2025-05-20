import { RegisterForm } from "./RegisterForm";

export function Register() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-24 h-24 mx-auto flex items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0">
              <img src="/assets/logo-dummy.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <RegisterForm />
    </div>
  );
}
