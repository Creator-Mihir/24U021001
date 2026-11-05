import { useEffect, useState } from "react";
import AdminHeader from "../admin/AdminHeader";
import AdminStats from "../admin/AdminStats";
import CategorySection from "../admin/CategorySection";
import HeritageForm from "../admin/HeritageForm";
import { HERITAGE_CATEGORIES } from "../admin/categories";

const API_URL = "http://127.0.0.1:8000";

function Admin() {
    const [heritage, setHeritage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadHeritage = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/heritage`);
            if (!response.ok) {
                throw new Error("Failed to load heritage records.");
            }
            const data = await response.json();
            setHeritage(data);
        } catch (err) {
            console.error(err);
            setError("Could not load heritage records. Make sure the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHeritage();
    }, []);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setMessage("");
        setError("");
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setMessage("");
        setError("");
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.name}"? This action will remove it from the knowledge base and refresh the FAISS index.`
        );
        if (!confirmed) return;

        setMessage("");
        setError("");

        try {
            const response = await fetch(`${API_URL}/admin/heritage/${item._id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || "Failed to delete heritage item.");
            }

            setMessage(`"${item.name}" deleted successfully.`);
            await loadHeritage();
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to delete heritage item.");
        }
    };

    const handleSave = async (formData, id) => {
        setSaving(true);
        setMessage("");
        setError("");

        try {
            // Clean payload for backend Pydantic validation
            const { _id, created_at, updated_at, ...cleanData } = formData;

            const url = id
                ? `${API_URL}/admin/heritage/${id}`
                : `${API_URL}/admin/heritage`;

            const method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cleanData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to save heritage data.");
            }

            setMessage(
                id
                    ? `"${formData.name}" updated successfully and FAISS index rebuilt.`
                    : `"${formData.name}" added successfully and FAISS index rebuilt.`
            );

            setShowForm(false);
            setEditingItem(null);
            await loadHeritage();
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred while saving heritage.");
        } finally {
            setSaving(false);
        }
    };

    // Group items by category according to HERITAGE_CATEGORIES
    const definedCategoryMap = new Map();
    HERITAGE_CATEGORIES.forEach((cat) => definedCategoryMap.set(cat, []));

    const otherItems = [];

    heritage.forEach((item) => {
        if (definedCategoryMap.has(item.category)) {
            definedCategoryMap.get(item.category).push(item);
        } else {
            otherItems.push(item);
        }
    });

    return (
        <div className="min-h-screen bg-[#f8f1e5]">
            {/* Top Navigation Bar */}
            <header className="border-b border-[#d8c7a8] bg-[#fffdf8]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8860b]">
                            Administration
                        </p>
                        <h1 className="heading-font text-2xl font-bold text-[#8b2635] sm:text-3xl">
                            Heritage Knowledge Base
                        </h1>
                    </div>

                    <a
                        href="/"
                        className="flex items-center gap-2 rounded-lg border border-[#d8c7a8] bg-[#faf6ee] px-4 py-2 text-sm font-medium text-[#594b41] transition hover:bg-[#f5ecdf]"
                    >
                        <span>&larr;</span> Back to Generator
                    </a>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
                {/* Header & Action Button */}
                <AdminHeader onAddHeritage={handleOpenCreate} />

                {/* Live Statistics Cards */}
                <AdminStats heritage={heritage} />

                {/* Success Banner */}
                {message && (
                    <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800 shadow-sm">
                        <span>{message}</span>
                        <button
                            onClick={() => setMessage("")}
                            className="ml-4 font-bold text-green-700 hover:text-green-900"
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-sm">
                        <span>{error}</span>
                        <button
                            onClick={() => setError("")}
                            className="ml-4 font-bold text-red-700 hover:text-red-900"
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Category Sections */}
                {loading ? (
                    <div className="rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] p-12 text-center text-[#74665b] shadow-sm">
                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#8b2635] border-t-transparent" />
                        <p className="font-medium">Loading heritage records...</p>
                    </div>
                ) : heritage.length === 0 ? (
                    <div className="rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] p-12 text-center shadow-sm">
                        <p className="heading-font text-2xl font-bold text-[#8b2635]">
                            No Heritage Records Yet
                        </p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-[#74665b]">
                            Start populating the cultural knowledge base to empower AI with authentic Indian heritage insights.
                        </p>
                        <button
                            onClick={handleOpenCreate}
                            className="mt-6 rounded-xl bg-[#8b2635] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#741f2d]"
                        >
                            + Add First Heritage
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {HERITAGE_CATEGORIES.map((category) => {
                            const items = definedCategoryMap.get(category) || [];
                            return (
                                <CategorySection
                                    key={category}
                                    category={category}
                                    heritage={items}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            );
                        })}

                        {otherItems.length > 0 && (
                            <CategorySection
                                key="Other Heritage"
                                category="Other Heritage"
                                heritage={otherItems}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                )}
            </main>

            {/* Form Modal (Add / Edit) */}
            <HeritageForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingItem(null);
                }}
                onSubmit={handleSave}
                initialData={editingItem}
                saving={saving}
            />
        </div>
    );
}

export default Admin;