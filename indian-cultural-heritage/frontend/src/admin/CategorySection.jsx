import HeritageCard from "./HeritageCard";

function CategorySection({
    category,
    heritage,
    onEdit,
    onDelete,
}) {

    if (heritage.length === 0) {
        return null;
    }

    return (
        <section>

            <div className="mb-5 flex items-end justify-between">

                <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8860b]">
                        {String(heritage.length).padStart(2, "0")} Heritage
                    </p>

                    <h2 className="heading-font mt-1 text-3xl font-bold text-[#8b2635]">
                        {category}
                    </h2>

                </div>

                <div className="hidden h-px flex-1 bg-[#d8c7a8] ml-8 md:block" />

            </div>


            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {heritage.map((item) => (
                    <HeritageCard
                        key={item._id}
                        heritage={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}

            </div>

        </section>
    );
}

export default CategorySection;