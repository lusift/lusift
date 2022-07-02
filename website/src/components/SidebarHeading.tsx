interface SidebarHeadingProps{
  title: string;
  children: React.ReactNode;
}

export const SidebarHeading: React.FC<SidebarHeadingProps> = ({ title, children }) => {
  return (
    <div className="heading">
      <h4>{title}</h4>
      <div>{children}</div>
      <style jsx>{`
        h4 {
          margin: 1.25rem 0;
          font-size: 1.2rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
