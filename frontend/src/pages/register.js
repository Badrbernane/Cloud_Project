import { RegisterForm } from "../components/register-form"

export default function RegisterPage({ onLogin }) {
  return (
    <div 
      className="fixed inset-0 w-full h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/images/ar.png')" }}
    >
      <div className="flex h-screen w-full items-center justify-center bg-black/10 p-6 backdrop-blur-sm md:p-10 overflow-y-auto">
        <div className="w-full max-w-sm">
          <RegisterForm onLogin={onLogin} />
        </div>
      </div>
    </div>
  )
}
