import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col space-y-10 pb-10 items-center justify-between lg:p-4">
      <LoginForm />
    </main>
  );
}
