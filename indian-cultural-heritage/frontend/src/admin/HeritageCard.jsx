function HeritageCard({
    heritage,
    onEdit,
    onDelete,
}) {

    const location = [
        heritage.location?.city,
        heritage.location?.state,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="group rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] p-5 shadow-[0_8px_30px_rgba(80,50,20,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(80,50,20,0.08)]">

            {/* Top */}
            <div className="flex items-start justify-between gap-4">

                <div className="flex-1">

                    <div className="mb-2 flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-[#f1e6d5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8b2635]">
                            {heritage.heritage_type}
                        </span>

                        {heritage.status && (
                            <span className="rounded-full bg-[#edf2e9] px-2.5 py-1 text-[10px] font-semibold text-[#355e3b]">
                                {heritage.status}
                            </span>
                        )}

                    </div>

                    <h3 className="heading-font text-2xl font-bold text-[#44372f]">
                        {heritage.name}
                    </h3>

                    {heritage.subcategory && (
                        <p className="mt-1 text-xs font-medium text-[#b8860b]">
                            {heritage.subcategory}
                        </p>
                    )}

                </div>

                <div className="flex gap-2">

                    <button
                        onClick={() => onEdit(heritage)}
                        className="rounded-lg border border-[#d8c7a8] px-3 py-2 text-xs font-semibold text-[#594b41] transition hover:bg-[#f5ecdf]"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(heritage)}
                        className="rounded-lg border border-[#e3c4c4] px-3 py-2 text-xs font-semibold text-[#9b3d3d] transition hover:bg-[#fdf0f0]"
                    >
                        Delete
                    </button>

                </div>

            </div>


            {/* Description */}
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#74665b]">
                {heritage.description || "No description available."}
            </p>


            {/* Details */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#eadfce] pt-4">

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a8d80]">
                        Location
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#594b41]">
                        {location || "Not specified"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a8d80]">
                        Period
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#594b41]">
                        {heritage.period?.era ||
                            heritage.period?.time_period ||
                            "Not specified"}
                    </p>
                </div>

            </div>


            {/* Keywords */}
            {heritage.keywords?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">

                    {heritage.keywords
                        .slice(0, 4)
                        .map((keyword) => (
                            <span
                                key={keyword}
                                className="rounded-md bg-[#faf3e7] px-2 py-1 text-[10px] text-[#796b5f]"
                            >
                                #{keyword}
                            </span>
                        ))}

                </div>
            )}

        </div>
    );
}

export default HeritageCard;