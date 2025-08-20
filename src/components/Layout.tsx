import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Heart,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'clientes',
      title: 'Clientes',
      icon: Users,
    },
    {
      id: 'calendario',
      title: 'Calendário',
      icon: Calendar,
    }
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="justify-start">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Heart className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-lg">Soul Saluttē</span>
                  <span className="truncate text-xs text-muted-foreground">Fisioterapia</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id} tooltip={item.title}>
                <SidebarMenuButton 
                  onClick={() => onNavigate(item.id)}
                  isActive={currentPage === item.id}
                  className="h-12"
                >
                  <item.icon className="size-5" />
                  <span className="truncate font-medium">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem tooltip="Configurações">
              <SidebarMenuButton className="h-12">
                <Settings className="size-5" />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem tooltip="Sair">
              <SidebarMenuButton onClick={logout} className="h-12 text-red-500 hover:bg-red-500/10 hover:text-red-600">
                <LogOut className="size-5" />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <div className="w-full border-t border-sidebar-border my-2" />
            </SidebarMenuItem>
            <SidebarMenuItem tooltip={user?.name || 'Usuário'}>
              <SidebarMenuButton className="h-14">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <span className="text-lg font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="text-sm font-medium capitalize">
              {menuItems.find(item => item.id === currentPage)?.title || 'Soul Saluttē'}
            </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;