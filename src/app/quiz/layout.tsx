export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col max-w-96 sm:max-w-[600px] md:max-w-[1000px] w-full m-auto  gap-6 p-3 ">
        {children}
      </div>
    </>
  );
}
