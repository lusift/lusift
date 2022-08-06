import cn from 'classnames';

export const Sidebar: React.FC<{
  active?: boolean;
  fixed?: boolean;
  children: any;
}> = ({ active, children, fixed }) => {

  return (
    <aside
      className={cn('sidebar sticky bg-white top-24 flex-shrink-0 pr-2', {
        active,
        ['pb-0 flex flex-col z-1 sticky']: fixed,
        fixed,
      })}
    >
      <div className="sidebar-content overflow-y-auto pb-4">{children}</div>
      <style jsx>{`
        .sidebar {
          -webkit-overflow-scrolling: touch;
        }
        .sidebar.fixed {
          width: 300px;
          padding-right: 2.5rem;
          /* Full page - content margin - header size - banner */
          height: calc(100vh - 1.5rem - 64px - 42px);
        }
        @media screen and (max-width: 1024px) {
          .sidebar,
          .sidebar.fixed {
            display: none;
          }
          .sidebar.active {
            display: block;
          }
        }
      `}</style>
    </aside>
  );
};
