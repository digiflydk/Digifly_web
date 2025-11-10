
import LoginForm from "@/components/dadmin/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Digifly Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
}
