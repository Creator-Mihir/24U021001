import { useState, useEffect } from "react";
import { HERITAGE_CATEGORIES } from "./categories";

export const emptyHeritageForm = {
    name: "",
    category: HERITAGE_CATEGORIES[0] || "Arts & Crafts",
    subcategory: "",
    heritage_type: "intangible",

    location: {
        country: "India",
        state: "",
        district: "",
        city: "",
        region: "",
    },

    period: {
        era: "",
        origin: "",
        time_period: "",
    },

    description: "",
    history: "",
    cultural_significance: "",

    traditions: [],
    rituals: [],
    communities: [],
    languages: [],

    visual_context: {
        attire: [],
        jewellery: [],
        objects: [],
        architecture: [],
        environment: [],
        colors_patterns: [],
        activities: [],
    },

    audio_context: {
        music: [],
        instruments: [],
    },

    related_heritage: [],
    keywords: [],
    generation_context: "",

    sources: [],
    status: "pending",
};

function HeritageForm({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    saving = false,
}) {
    const [form, setForm] = useState(emptyHeritageForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                ...emptyHeritageForm,
                ...initialData,
                location: {
                    ...emptyHeritageForm.location,
                    ...(initialData.location || {}),
                },
                period: {
                    ...emptyHeritageForm.period,
                    ...(initialData.period || {}),
                },
                visual_context: {
                    ...emptyHeritageForm.visual_context,
                    ...(initialData.visual_context || {}),
                },
                audio_context: {
                    ...emptyHeritageForm.audio_context,
                    ...(initialData.audio_context || {}),
                },
                traditions: initialData.traditions || [],
                rituals: initialData.rituals || [],
                communities: initialData.communities || [],
                languages: initialData.languages || [],
                keywords: initialData.keywords || [],
                sources: initialData.sources || [],
            });
        } else {
            setForm(emptyHeritageForm);
        }
    }, [initialData, isOpen]);

    if (!isOpen) {
        return null;
    }

    const isEdit = Boolean(initialData?._id);

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateNestedField = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const arrayValue = (value) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form, initialData?._id);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-8">
            <div className="mx-auto max-w-5xl rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[#e1d4c0] px-6 py-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8860b]">
                            {isEdit ? "Update Entry" : "Knowledge Entry"}
                        </p>
                        <h2 className="heading-font mt-1 text-3xl font-bold text-[#8b2635]">
                            {isEdit ? `Edit: ${initialData.name}` : "Add Cultural Heritage"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-[#77695e] transition hover:bg-[#f5ecdf] hover:text-[#332a24]"
                    >
                        &times;
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
                    {/* Basic Information */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            Basic Information
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Name"
                                required
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder="e.g. Kalamkari, Bharatanatyam, Diwali"
                            />

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#594b41]">
                                    Category <span className="ml-1 text-[#8b2635]">*</span>
                                </label>
                                <select
                                    required
                                    value={form.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                    className="w-full rounded-lg border border-[#d8c7a8] bg-[#faf6ee] px-4 py-3 text-[#332a24] outline-none focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10"
                                >
                                    <option value="" disabled>Select category</option>
                                    {HERITAGE_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Subcategory"
                                required
                                value={form.subcategory}
                                onChange={(e) => updateField("subcategory", e.target.value)}
                                placeholder="e.g. Textile Art, Classical Dance, Temple Architecture"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#594b41]">
                                        Heritage Type
                                    </label>
                                    <select
                                        value={form.heritage_type}
                                        onChange={(e) => updateField("heritage_type", e.target.value)}
                                        className="w-full rounded-lg border border-[#d8c7a8] bg-[#faf6ee] px-4 py-3 text-[#332a24] outline-none focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10"
                                    >
                                        <option value="intangible">Intangible</option>
                                        <option value="tangible">Tangible</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#594b41]">
                                        Status
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => updateField("status", e.target.value)}
                                        className="w-full rounded-lg border border-[#d8c7a8] bg-[#faf6ee] px-4 py-3 text-[#332a24] outline-none focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            Location
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="State"
                                value={form.location.state}
                                onChange={(e) => updateNestedField("location", "state", e.target.value)}
                                placeholder="e.g. Andhra Pradesh, Gujarat, Tamil Nadu"
                            />

                            <Input
                                label="District"
                                value={form.location.district}
                                onChange={(e) => updateNestedField("location", "district", e.target.value)}
                                placeholder="e.g. Krishna, Thanjavur"
                            />

                            <Input
                                label="City / Town"
                                value={form.location.city}
                                onChange={(e) => updateNestedField("location", "city", e.target.value)}
                                placeholder="e.g. Machilipatnam, Varanasi"
                            />

                            <Input
                                label="Region"
                                value={form.location.region}
                                onChange={(e) => updateNestedField("location", "region", e.target.value)}
                                placeholder="e.g. Coastal Andhra, Braj, Malwa"
                            />
                        </div>
                    </section>

                    {/* Period */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            Historical Period
                        </h3>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Input
                                label="Era"
                                value={form.period.era}
                                onChange={(e) => updateNestedField("period", "era", e.target.value)}
                                placeholder="e.g. Medieval, Ancient, Vijayanagara"
                            />

                            <Input
                                label="Origin"
                                value={form.period.origin}
                                onChange={(e) => updateNestedField("period", "origin", e.target.value)}
                                placeholder="e.g. Golconda Sultanate, Vedic Period"
                            />

                            <Input
                                label="Time Period"
                                value={form.period.time_period}
                                onChange={(e) => updateNestedField("period", "time_period", e.target.value)}
                                placeholder="e.g. 16th century, 2nd century BCE"
                            />
                        </div>
                    </section>

                    {/* Cultural Information */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            Cultural Information
                        </h3>

                        <div className="space-y-4">
                            <Textarea
                                label="Description"
                                required
                                value={form.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                placeholder="Comprehensive description of this cultural heritage..."
                            />

                            <Textarea
                                label="History"
                                value={form.history}
                                onChange={(e) => updateField("history", e.target.value)}
                                placeholder="Historical roots, evolution, and lineage..."
                            />

                            <Textarea
                                label="Cultural Significance"
                                value={form.cultural_significance}
                                onChange={(e) => updateField("cultural_significance", e.target.value)}
                                placeholder="Spiritual, symbolic, or communal significance..."
                            />
                        </div>
                    </section>

                    {/* Cultural Elements */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            Cultural Elements
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <ArrayInput
                                label="Traditions"
                                placeholder="Dandiya, Raslila, community dance"
                                value={form.traditions.join(", ")}
                                onChange={(value) => updateField("traditions", arrayValue(value))}
                            />

                            <ArrayInput
                                label="Rituals"
                                placeholder="Mangala aarti, ceremonial oblations"
                                value={form.rituals.join(", ")}
                                onChange={(value) => updateField("rituals", arrayValue(value))}
                            />

                            <ArrayInput
                                label="Communities"
                                placeholder="Gujarati communities, Saurashtra weavers"
                                value={form.communities.join(", ")}
                                onChange={(value) => updateField("communities", arrayValue(value))}
                            />

                            <ArrayInput
                                label="Languages"
                                placeholder="Telugu, Sanskrit, Hindi"
                                value={form.languages.join(", ")}
                                onChange={(value) => updateField("languages", arrayValue(value))}
                            />
                        </div>
                    </section>

                    {/* Visual Context */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            Visual Context
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <ArrayInput
                                label="Attire"
                                placeholder="Chaniya choli, dhoti, angavastram"
                                value={form.visual_context.attire.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("visual_context", "attire", arrayValue(value))
                                }
                            />

                            <ArrayInput
                                label="Jewellery"
                                placeholder="Oxidized silver, temple jewellery, jhumkas"
                                value={form.visual_context.jewellery.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("visual_context", "jewellery", arrayValue(value))
                                }
                            />

                            <ArrayInput
                                label="Objects / Implements"
                                placeholder="Dandiya sticks, brass lamps, bamboo pens"
                                value={form.visual_context.objects.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("visual_context", "objects", arrayValue(value))
                                }
                            />

                            <ArrayInput
                                label="Architecture"
                                placeholder="Dravidian gopuram, courtyard haveli"
                                value={form.visual_context.architecture.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("visual_context", "architecture", arrayValue(value))
                                }
                            />

                            <ArrayInput
                                label="Environment / Setting"
                                placeholder="Village courtyard, ghats of river, temple sanctum"
                                value={form.visual_context.environment.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("visual_context", "environment", arrayValue(value))
                                }
                            />

                            <ArrayInput
                                label="Colors & Patterns"
                                placeholder="Indigo, earthy madder red, paisley, lotus motifs"
                                value={form.visual_context.colors_patterns.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("visual_context", "colors_patterns", arrayValue(value))
                                }
                            />

                            <ArrayInput
                                label="Activities / Postures"
                                placeholder="Block printing, rhythmic footwork, devotional singing"
                                value={form.visual_context.activities.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("visual_context", "activities", arrayValue(value))
                                }
                            />
                        </div>
                    </section>

                    {/* Audio Context */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            Audio Context
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <ArrayInput
                                label="Music Styles"
                                placeholder="Carnatic classical, Baul folk song"
                                value={form.audio_context.music.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("audio_context", "music", arrayValue(value))
                                }
                            />

                            <ArrayInput
                                label="Instruments"
                                placeholder="Mridangam, Shehnai, Veena, Dhol"
                                value={form.audio_context.instruments.join(", ")}
                                onChange={(value) =>
                                    updateNestedField("audio_context", "instruments", arrayValue(value))
                                }
                            />
                        </div>
                    </section>

                    {/* AI Generation Context */}
                    <section>
                        <h3 className="mb-4 text-lg font-semibold text-[#8b2635]">
                            AI Generation Context
                        </h3>

                        <div className="space-y-4">
                            <ArrayInput
                                label="Keywords"
                                placeholder="Kalamkari, cotton craft, natural dye, Andhra, peacock motif"
                                value={form.keywords.join(", ")}
                                onChange={(value) => updateField("keywords", arrayValue(value))}
                            />

                            <Textarea
                                label="Generation Guidance Context"
                                value={form.generation_context || ""}
                                onChange={(e) => updateField("generation_context", e.target.value)}
                                placeholder="Explicit visual details to guide prompt enrichment and image synthesis..."
                            />
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-[#e1d4c0] pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border border-[#d8c7a8] px-5 py-3 font-medium text-[#594b41] transition hover:bg-[#f5ecdf] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-[#8b2635] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#741f2d] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{isEdit ? "Update Heritage" : "Save Heritage"}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* Helper Input Components */

function Input({ label, required, value, onChange, placeholder }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#594b41]">
                {label}
                {required && <span className="ml-1 text-[#8b2635]">*</span>}
            </label>
            <input
                required={required}
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-[#d8c7a8] bg-[#faf6ee] px-4 py-3 text-[#332a24] outline-none placeholder:text-[#a39486] focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10"
            />
        </div>
    );
}

function Textarea({ label, required, value, onChange, placeholder, rows = 3 }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#594b41]">
                {label}
                {required && <span className="ml-1 text-[#8b2635]">*</span>}
            </label>
            <textarea
                required={required}
                rows={rows}
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full resize-y rounded-lg border border-[#d8c7a8] bg-[#faf6ee] px-4 py-3 text-[#332a24] outline-none placeholder:text-[#a39486] focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10"
            />
        </div>
    );
}

function ArrayInput({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#594b41]">
                {label}
            </label>
            <input
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-[#d8c7a8] bg-[#faf6ee] px-4 py-3 text-[#332a24] outline-none placeholder:text-[#a39486] focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10"
            />
            <p className="mt-1 text-[11px] text-[#97897c]">
                Separate multiple items with commas.
            </p>
        </div>
    );
}

export default HeritageForm;
