import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

const WEBHOOK_URL =
  "https://asadullah-95e.app.n8n.cloud/webhook-test/yt-automation";

const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|live\/)[\w-]{6,}|youtu\.be\/[\w-]{6,})([&?][^\s]*)?$/i;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shortsmith — Turn long videos into viral shorts" },
      {
        name: "description",
        content:
          "Feed a YouTube URL and get AI-generated short clips published to YouTube Shorts and Instagram Reels automatically.",
      },
      {
        property: "og:title",
        content: "Shortsmith — Turn long videos into viral shorts",
      },
      {
        property: "og:description",
        content:
          "Automated workflow that clips, captions, and publishes short-form video from any YouTube link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type FormState = {
  youtubeUrl: string;
  numberOfClips: string;
  aspectRatio: string;
  applyCaptions: string;
};

const INITIAL: FormState = {
  youtubeUrl: "",
  numberOfClips: "3",
  aspectRatio: "9:16",
  applyCaptions: "yes",
};

function Index() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<{ status?: number; message: string } | null>(
    null,
  );

  const update = (k: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setForm(INITIAL);
    setResult(null);
    setError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const url = form.youtubeUrl.trim();
    if (!url) {
      setError({ message: "YouTube URL is required." });
      return;
    }
    if (!YOUTUBE_URL_REGEX.test(url)) {
      setError({
        message:
          "Please enter a valid YouTube link (youtube.com/watch, youtu.be, shorts, or embed).",
      });
      return;
    }
    const n = Number(form.numberOfClips);
    if (!Number.isFinite(n) || n < 1) {
      setError({ message: "Enter a valid number of clips (1 or more)." });
      return;
    }

    const body = {
      youtubeUrl: form.youtubeUrl.trim(),
      numberOfClips: n,
      aspectRatio: form.aspectRatio,
      applyCaptions: form.applyCaptions,
    };

    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let json: unknown = null;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        setError({
          status: res.status,
          message: "Response was not valid JSON.",
        });
        return;
      }
      if (!res.ok) {
        setError({
          status: res.status,
          message:
            (json && typeof json === "object" && "error" in json
              ? String((json as Record<string, unknown>).error)
              : "") || `Request failed with status ${res.status}.`,
        });
        return;
      }
      setResult((json ?? {}) as Record<string, unknown>);
    } catch (err) {
      setError({
        message:
          err instanceof Error
            ? err.message
            : "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resultEntries = result ? Object.entries(result) : [];

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#0d3d2e]">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d3d2e]">
            <img
              src="/favicon.png"
              alt="Shortsmith"
              width={40}
              height={40}
              className="h-8 w-8 rounded-lg"
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">Shortsmith</span>
        </div>
        <a
          href="#"
          className="rounded-full border border-[#0d3d2e]/20 bg-white/70 px-4 py-2 text-xs font-medium text-[#0d3d2e] shadow-sm"
        >
          Workflow by Asadullah ↗
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#0d3d2e]/15 bg-white/70 px-3 py-1 text-xs font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Automated shorts workflow
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-black md:text-6xl">
          Turn any long video into{" "}
          <em className="font-serif italic text-[#0d3d2e]">viral shorts</em>, on
          autopilot.
        </h1>
        <p className="mt-5 max-w-xl text-base text-[#0d3d2e]/70">
          Paste a YouTube link. Our workflow finds the best moments, cuts your
          clips, captions them, and publishes to Shorts and Reels.
        </p>
      </section>

      {/* Main grid */}
      <main className="mx-auto mt-10 grid max-w-6xl gap-6 px-6 pb-20 lg:grid-cols-[1.4fr_1fr]">
        {/* Form card */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-[#0d3d2e]/10 bg-[#fcfbf5] p-8 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium tracking-widest text-[#0d3d2e]/50">
                01 · COMPOSE
              </div>
              <h2 className="mt-1 font-serif text-2xl">Brief the workflow</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Ready
            </span>
          </div>

          <div className="mt-8 space-y-6">
            <Field label="YouTube URL" required>
              <input
                type="url"
                required
                value={form.youtubeUrl}
                onChange={(e) => update("youtubeUrl")(e.target.value)}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && !YOUTUBE_URL_REGEX.test(v)) {
                    e.target.setCustomValidity(
                      "Enter a valid YouTube link (youtube.com, youtu.be, or /shorts).",
                    );
                  } else {
                    e.target.setCustomValidity("");
                  }
                }}
                onInput={(e) => e.currentTarget.setCustomValidity("")}
                pattern="^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|live\/)[\w-]{6,}|youtu\.be\/[\w-]{6,}).*$"
                title="Must be a YouTube link (youtube.com/watch, youtu.be, /shorts, or /embed)"
                placeholder="https://www.youtube.com/watch?v=..."
                inputMode="url"
                className={inputCls}
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Number of clips" required>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.numberOfClips}
                  onChange={(e) => update("numberOfClips")(e.target.value)}
                  placeholder="3"
                  className={inputCls}
                />
              </Field>

              <Field label="Aspect ratio" required>
                <SegmentedControl
                  value={form.aspectRatio}
                  onChange={update("aspectRatio")}
                  options={[
                    { value: "9:16", label: "9:16", hint: "Vertical" },
                    { value: "1:1", label: "1:1", hint: "Square" },
                  ]}
                />
              </Field>
            </div>

            <Field label="Apply captions" required>
              <SegmentedControl
                value={form.applyCaptions}
                onChange={update("applyCaptions")}
                options={[
                  { value: "yes", label: "Yes", hint: "Burn captions into clips" },
                  { value: "no", label: "No", hint: "Leave clips uncaptioned" },
                ]}
              />
            </Field>
          </div>


          <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-[#0d3d2e]/10 pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-[#0d3d2e]/60">
              Clips are uploaded to Drive and published automatically.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-[#0d3d2e] px-6 py-3 text-sm font-medium text-[#fcfbf5] shadow-sm transition hover:bg-[#0d3d2e]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing…" : "Generate shorts"} ↗
            </button>
          </div>
        </form>

        {/* Result panel */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl bg-[#0d3d2e] p-8 text-[#fcfbf5] shadow-sm">
            <div className="text-xs font-medium tracking-widest text-[#fcfbf5]/60">
              02 · RESULT
            </div>
            <h2 className="mt-1 font-serif text-2xl">Workflow output</h2>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
              {loading && (
                <div>
                  <div className="font-medium">Sending to n8n…</div>
                  <p className="mt-1 text-[#fcfbf5]/70">
                    Hang tight while the webhook accepts your job.
                  </p>
                </div>
              )}

              {!loading && error && (
                <div>
                  <div className="font-medium text-rose-200">
                    {error.status ? `Error ${error.status}` : "Request failed"}
                  </div>
                  <p className="mt-1 text-[#fcfbf5]/80">{error.message}</p>
                  <button
                    onClick={submit as unknown as () => void}
                    className="mt-4 rounded-full bg-white/10 px-4 py-2 text-xs font-medium hover:bg-white/20"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && result && resultEntries.length === 0 && (
                <div className="text-[#fcfbf5]/80">No data returned.</div>
              )}

              {!loading && !error && result && resultEntries.length > 0 && (
                <div className="divide-y divide-white/10">
                  {resultEntries.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-3 gap-3 py-3 text-sm">
                      <div className="col-span-1 text-[#fcfbf5]/60">{k}</div>
                      <div className="col-span-2 break-words font-medium">
                        {typeof v === "object"
                          ? JSON.stringify(v, null, 2)
                          : String(v)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && !result && (
                <div>
                  <div className="font-medium">Waiting for your brief</div>
                  <p className="mt-1 text-[#fcfbf5]/70">
                    Fill out the form and hit Generate shorts. The n8n response
                    appears here.
                  </p>
                </div>
              )}
            </div>

            {(result || error) && !loading && (
              <button
                onClick={reset}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium hover:bg-white/10"
              >
                Run again
              </button>
            )}
          </div>

          <ul className="space-y-2 rounded-3xl border border-[#0d3d2e]/10 bg-[#fcfbf5] p-6 text-sm text-[#0d3d2e]/80 shadow-sm">
            <Bullet>Drops clips into Google Drive automatically.</Bullet>
            <Bullet>Publishes to YouTube Shorts and Instagram Reels.</Bullet>
            <Bullet>Emails you the moment publishing completes.</Bullet>
          </ul>
        </aside>
      </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#0d3d2e]/15 bg-white/70 px-4 py-3 text-sm text-[#0d3d2e] placeholder-[#0d3d2e]/40 outline-none transition focus:border-[#0d3d2e]/40 focus:bg-white";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-1 text-sm font-medium">
        {label}
        {required && <span className="text-amber-600">*</span>}
      </div>
      {children}
    </label>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
      <span>{children}</span>
    </li>
  );
}

function SegmentedControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#0d3d2e]/15 bg-white/70 p-1.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-2.5 text-sm transition ${
              active
                ? "bg-[#0d3d2e] text-[#fcfbf5] shadow-sm"
                : "text-[#0d3d2e]/70 hover:bg-white"
            }`}
          >
            <span className="font-semibold">{opt.label}</span>
            {opt.hint && (
              <span
                className={`mt-0.5 text-[11px] ${
                  active ? "text-[#fcfbf5]/70" : "text-[#0d3d2e]/50"
                }`}
              >
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

