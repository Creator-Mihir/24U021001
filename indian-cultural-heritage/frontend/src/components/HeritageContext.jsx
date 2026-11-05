function HeritageContext({ heritage }) {

  if (!heritage || heritage.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] p-6">

      <div className="mb-5">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8860b]">
          Cultural Context
        </p>

        <h2 className="heading-font mt-1 text-3xl font-semibold text-[#8b2635]">
          Heritage used for generation
        </h2>

      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {heritage.map((item, index) => (

          <div
            key={`${item.name}-${index}`}
            className="rounded-xl border border-[#e1d4c0] bg-[#faf6ee] p-4"
          >

            <div className="flex items-start justify-between gap-3">

              <div>

                <h3 className="font-semibold text-[#44372f]">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-[#88796c]">
                  {item.category}
                </p>

                {item.subcategory && (
                  <p className="mt-1 text-xs text-[#9a8d80]">
                    {item.subcategory}
                  </p>
                )}

              </div>

              <span className="rounded-full bg-[#eee1c9] px-2 py-1 text-[10px] font-semibold text-[#725a32]">
                {(item.score * 100).toFixed(0)}%
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default HeritageContext;