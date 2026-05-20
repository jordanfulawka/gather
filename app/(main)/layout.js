import Sidebar from '@/components/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className='flex h-full overflow-hidden'>
      <Sidebar />
      <div className='flex-1 overflow-hidden'>{children}</div>
    </div>
  );
}
