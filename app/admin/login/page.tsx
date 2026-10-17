import LoginForm from "../../../components/admin/LoginForm";
import { site } from "../../../lib/site";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-petal md:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-petal text-2xl">
          🔐
        </div>
        <h1 className="mt-4 text-center font-display text-2xl">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-plum/60">{site.name}</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}