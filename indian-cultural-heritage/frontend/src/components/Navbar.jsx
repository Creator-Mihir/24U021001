function Navbar() {
  return (
    <nav className="border-b border-[#d8c7a8] bg-[#fffdf8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b8860b] text-[#8b2635]">
            <span className="text-xl">✦</span>
          </div>

          <div>
            <h1 className="heading-font text-2xl font-bold text-[#8b2635]">
              भारतीय विरासत
            </h1>

            <p className="text-[10px] font-semibold tracking-[0.25em] text-[#6f6258]">
              INDIAN HERITAGE
            </p>
          </div>

        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">

          <a
            href="#home"
            className="text-[#332a24] transition hover:text-[#8b2635]"
          >
            Home
          </a>

          <a
            href="#about"
            className="text-[#332a24] transition hover:text-[#8b2635]"
          >
            About
          </a>

          <a
            href="#heritage"
            className="text-[#332a24] transition hover:text-[#8b2635]"
          >
            Heritage
          </a>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;