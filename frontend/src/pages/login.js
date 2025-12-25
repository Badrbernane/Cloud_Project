import { LoginForm } from "../components/login-form"

export default function LoginPage({ onSignUp, onLogin }) {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/ar.png')" }}
    >
      <div className="flex min-h-screen w-full items-center justify-center bg-black/10 p-6 backdrop-blur-sm md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm onSignUp={onSignUp} onLogin={onLogin} />
        </div>
      </div>
    </div>
  )
}
