import LoginForm from "@/components/login-form";

export default function Login() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="w-2/3 lg:w-1/4">
        <LoginForm />
      </div>
    </div>
  );
}
