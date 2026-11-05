function PromptBox({
  prompt,
  setPrompt,
  onGenerate,
  loading
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prompt.trim() || loading) {
      return;
    }

    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">

      <div className="rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] p-5 shadow-[0_10px_40px_rgba(80,50,20,0.06)]">

        <label className="mb-3 block text-sm font-semibold text-[#5f5147]">
          Describe the image you want
        </label>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Gujarati women performing Garba during Navratri..."
          rows={5}
          className="w-full resize-none rounded-xl border border-[#dfd1bb] bg-[#faf6ee] p-4 text-[#332a24] outline-none transition placeholder:text-[#9a8d80] focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10"
        />

        <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

          <p className="text-xs text-[#85776c]">
            Cultural context will be added automatically.
          </p>

          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="flex items-center gap-2 rounded-xl bg-[#8b2635] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#741f2d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <span>✦</span>
                Generate Image
              </>
            )}
          </button>

        </div>

      </div>

    </form>
  );
}

export default PromptBox;