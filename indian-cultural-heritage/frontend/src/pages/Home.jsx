import { useState } from "react";

import Navbar from "../components/Navbar";
import PromptBox from "../components/PromptBox";
import GeneratedImage from "../components/GeneratedImage";
import HeritageContext from "../components/HeritageContext";


const API_URL = "http://127.0.0.1:8000";


function Home() {

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const [heritage, setHeritage] = useState([]);

  const [enrichedPrompt, setEnrichedPrompt] = useState("");

  const [error, setError] = useState("");


  const generateImage = async () => {

    if (!prompt.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl("");
    setHeritage([]);
    setEnrichedPrompt("");


    try {

      const response = await fetch(
        `${API_URL}/generation/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt: prompt,
            top_k: 3,
          }),
        }
      );


      if (!response.ok) {
        let errorMsg = "Failed to generate image";
        try {
          const errData = await response.json();
          if (errData?.detail) {
            errorMsg = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }


      const data = await response.json();


      if (!data.image_url) {

        throw new Error(
          data.message ||
          "Could not generate the image."
        );

      }


      const fullImageUrl =
        `${API_URL}${data.image_url}`;


      setImageUrl(fullImageUrl);

      setHeritage(
        data.retrieved_heritage || []
      );

      setEnrichedPrompt(
        data.enriched_prompt || ""
      );


    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Something went wrong while generating the image."
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="min-h-screen bg-[#f8f1e5]">

      <Navbar />


      {/* Hero */}
      <main id="home">

        <section className="relative overflow-hidden px-6 pb-16 pt-20">

          {/* Decorative elements */}

          <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full border border-[#d8c7a8]/50" />

          <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full border border-[#d8c7a8]/50" />


          <div className="relative mx-auto max-w-4xl text-center">

            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#b8860b]">
              AI • Culture • Heritage
            </p>


            <h1 className="heading-font text-5xl font-bold leading-tight text-[#8b2635] md:text-7xl">

              Imagine India's
              <br />

              <span className="text-[#332a24]">
                Cultural Heritage
              </span>

            </h1>


            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6e6157] md:text-lg">

              Transform your ideas into culturally enriched
              visual stories. Our system retrieves relevant
              Indian heritage knowledge and uses it to guide
              AI image generation.

            </p>

          </div>

        </section>


        {/* Generator */}
        <section className="px-6 pb-16">

          <div className="mx-auto max-w-4xl">

            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={generateImage}
              loading={loading}
            />


            {/* Error */}
            {error && (

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>

            )}

          </div>

        </section>


        {/* Result */}
        <section className="px-6 pb-20">

          <div className="mx-auto max-w-6xl">

            <div className="mb-6">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8860b]">
                Your Creation
              </p>

              <h2 className="heading-font mt-1 text-4xl font-semibold text-[#8b2635]">
                Generated Image
              </h2>

            </div>


            <GeneratedImage
              imageUrl={imageUrl}
            />

          </div>

        </section>


        {/* Heritage */}
        {heritage.length > 0 && (

          <section
            id="heritage"
            className="px-6 pb-20"
          >

            <div className="mx-auto max-w-6xl">

              <HeritageContext
                heritage={heritage}
              />

            </div>

          </section>

        )}


        {/* Enriched Prompt */}
        {enrichedPrompt && (

          <section className="px-6 pb-20">

            <div className="mx-auto max-w-6xl">

              <details className="rounded-2xl border border-[#d8c7a8] bg-[#fffdf8]">

                <summary className="cursor-pointer p-5 font-semibold text-[#594b41]">
                  View enriched prompt
                </summary>

                <div className="border-t border-[#e2d5c2] p-5">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-[#6e6157]">
                    {enrichedPrompt}
                  </p>

                </div>

              </details>

            </div>

          </section>

        )}


      </main>


      {/* Footer */}
      <footer className="border-t border-[#d8c7a8] bg-[#f1e6d5] px-6 py-8">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

          <div>

            <p className="heading-font text-xl font-semibold text-[#8b2635]">
              भारतीय विरासत
            </p>

            <p className="text-xs text-[#77695e]">
              Preserving culture through technology.
            </p>

          </div>

          <p className="text-xs text-[#897b6e]">
            Indian Cultural Heritage Image Generation
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;