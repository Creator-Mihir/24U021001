function AdminHeader({ onAddHeritage }) {
    return (
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b8860b]">
                    Heritage Management
                </p>

                <h1 className="heading-font mt-2 text-5xl font-bold text-[#8b2635]">
                    Cultural Heritage
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74665b]">
                    Manage the cultural knowledge used by the AI image generation system.
                </p>
            </div>

            <button
                onClick={onAddHeritage}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#8b2635] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#741f2d]"
            >
                <span className="text-lg">+</span>
                Add Heritage
            </button>

        </div>
    );
}

export default AdminHeader;