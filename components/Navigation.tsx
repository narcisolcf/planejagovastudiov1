'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navigation() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const perfilRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
      if (perfilRef.current && !perfilRef.current.contains(event.target as Node)) {
        setPerfilAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Fechar menu ao pressionar Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuAberto(false);
        setPerfilAberto(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="bg-white shadow-md sticky top-0 z-50"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo e Menu Desktop */}
          <div className="flex">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <span className="text-xl font-bold text-blue-600">PlanejaGov</span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8" role="menubar">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive('/')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                role="menuitem"
              >
                Início
              </Link>

              {user && (
                <>
                  <Link
                    href="/planos"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive('/planos')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    role="menuitem"
                  >
                    Planos
                  </Link>

                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive('/dashboard')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Ações Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="relative" ref={perfilRef}>
                <button
                  onClick={() => setPerfilAberto(!perfilAberto)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-expanded={perfilAberto}
                  aria-haspopup="true"
                  aria-label="Menu do usuário"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.nome}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${perfilAberto ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown do Perfil */}
                {perfilAberto && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Configurações
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded={menuAberto}
              aria-label="Menu principal"
            >
              <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuAberto ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="sm:hidden" ref={menuRef} role="menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive('/')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              role="menuitem"
              onClick={() => setMenuAberto(false)}
            >
              Início
            </Link>

            {user && (
              <>
                <Link
                  href="/planos"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive('/planos')
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Planos
                </Link>

                <Link
                  href="/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Seção do Usuário Mobile */}
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.nome}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  href="/configuracoes"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Configurações
                </Link>
                <button
                  onClick={() => {
                    setMenuAberto(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  role="menuitem"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                href="/login"
                className="block px-4 py-2 text-base font-medium text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
                onClick={() => setMenuAberto(false)}
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
