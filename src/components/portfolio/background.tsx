export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#05070f]" />
      <div className="aurora aurora-1 absolute -top-52 -left-40 h-[40rem] w-[40rem] bg-sky-500/20" />
      <div className="aurora aurora-2 absolute -top-24 right-[-14rem] h-[34rem] w-[34rem] bg-indigo-500/20" />
      <div className="aurora aurora-3 absolute top-[52%] left-1/3 h-[32rem] w-[32rem] bg-fuchsia-500/12" />
      <div className="grid-lines absolute inset-0 opacity-70" />
      <div className="noise absolute inset-0 opacity-[0.04]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#05070f] via-[#05070f]/70 to-transparent" />
    </div>
  );
}
