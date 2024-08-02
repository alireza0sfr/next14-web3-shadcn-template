export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex h-dvh w-screen flex-col page-scroll bg-black" id="pageContainer">
        <div className='grow bg-card-background default-layout landing-bg'>
          <div className='grow default-body'>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}