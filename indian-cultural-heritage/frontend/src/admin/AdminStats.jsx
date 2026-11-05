function AdminStats({ heritage }) {

    const total = heritage.length;

    const categories = new Set(
        heritage.map((item) => item.category)
    ).size;

    const pending = heritage.filter(
        (item) => item.status === "pending"
    ).length;

    const stats = [
        {
            label: "Total Heritage",
            value: total,
            icon: "✦",
        },
        {
            label: "Categories",
            value: categories,
            icon: "◈",
        },
        {
            label: "Pending Review",
            value: pending,
            icon: "◷",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">

            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] p-5 shadow-[0_8px_30px_rgba(80,50,20,0.04)]"
                >
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#88796c]">
                                {stat.label}
                            </p>

                            <p className="heading-font mt-2 text-4xl font-bold text-[#8b2635]">
                                {stat.value}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3e7d3] text-xl text-[#b8860b]">
                            {stat.icon}
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
}

export default AdminStats;