import { useState } from "react";

function GeneratedImage({ imageUrl }) {

  const [fullscreen, setFullscreen] = useState(false);

  if (!imageUrl) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[#d8c7a8] bg-[#fffdf8]">

        <div className="text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e7d3] text-2xl text-[#8b2635]">
            ✦
          </div>

          <h3 className="heading-font text-2xl font-semibold text-[#594b41]">
            Your creation will appear here
          </h3>

          <p className="mt-2 text-sm text-[#8b7d70]">
            Describe an Indian cultural scene and generate an image.
          </p>

        </div>

      </div>
    );
  }

  const handleDownload = async () => {

    try {

      const response = await fetch(imageUrl);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "indian-cultural-heritage.png";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error("Download failed:", error);

    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#d8c7a8] bg-[#fffdf8] shadow-[0_10px_40px_rgba(80,50,20,0.08)]">

        <div className="bg-[#eee2ce] p-3">

          <div className="overflow-hidden rounded-xl bg-[#eee2ce]">

            <img
              src={imageUrl}
              alt="Generated Indian cultural heritage"
              className="mx-auto block max-h-[650px] w-full object-contain"
            />

          </div>

        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#e2d5c2] p-4">

          <button
            onClick={() => setFullscreen(true)}
            className="rounded-lg border border-[#cdbb9e] px-4 py-2 text-sm font-medium text-[#594b41] transition hover:bg-[#f5ecdf]"
          >
            ⛶ Fullscreen
          </button>

          <button
            onClick={handleDownload}
            className="rounded-lg bg-[#8b2635] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#741f2d]"
          >
            ↓ Download
          </button>

        </div>

      </div>

      {/* Fullscreen */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5"
          onClick={() => setFullscreen(false)}
        >

          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-xl text-white hover:bg-white/20"
          >
            ×
          </button>

          <img
            src={imageUrl}
            alt="Fullscreen generated heritage"
            className="max-h-[92vh] max-w-[95vw] object-contain"
          />

        </div>
      )}

    </>
  );
}

export default GeneratedImage;