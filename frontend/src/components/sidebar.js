import { HomeIcon, ShoppingCartIcon, ChartBarIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline'

export default function Sidebar({ onLogout, onNavigate = () => {} }) {
  return (
    <div className="fixed left-0 top-0 w-20 h-screen bg-red-900/70 backdrop-blur-sm flex flex-col items-center justify-center py-4 space-y-6">
      <img src="/images/logo.png" alt="Logo" className="h-12 w-12 absolute top-4"/>
      <HomeIcon onClick={() => onNavigate('home')} className="h-6 w-6 text-white/90 hover:text-white cursor-pointer"/>
      <ShoppingCartIcon onClick={() => onNavigate('shop')} className="h-6 w-6 text-white/80 hover:text-white cursor-pointer"/>
      <ChartBarIcon onClick={() => onNavigate('fantazy')} className="h-6 w-6 text-white/80 hover:text-white cursor-pointer"/>
      <CogIcon onClick={() => onNavigate('profile')} className="h-6 w-6 text-white/80 hover:text-white cursor-pointer"/>

      <LogoutIcon onClick={onLogout} className="h-6 w-6 text-white/80 hover:text-white cursor-pointer absolute bottom-4"/>
    </div>
  )
}
