import { Clock } from 'lucide-react'
import { useNow } from '@/exam/shell/time'
import { site } from '@/site.config'

const START = 37 * 60 + 12

function Line({ w, mark }: { w: string; mark?: boolean }) {
  return <span className={`block h-[7px] rounded-full ${mark ? 'bg-mark' : 'bg-ink-900/10'}`} style={{ width: w }} />
}

/** A miniature of the test screen for the landing page — decorative, so hidden from assistive tech. */
export function ExamPreview() {
  const now = useNow(1000)
  const seconds = START - (Math.floor(now / 1000) % 600)
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div className="relative" aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-mark/40 blur-3xl" />
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(11,16,32,0.35)] ring-1 ring-ink-900/10" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="flex h-10 items-center justify-between border-b border-[#c9c9c9] px-3">
          <span className="rounded-[3px] bg-ink-950 px-1.5 py-0.5 text-[9px] font-black tracking-wide text-white">{site.shortName}</span>
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-ink-950">
            <Clock size={13} /> {clock} <span className="font-normal text-ink-500">left</span>
          </span>
          <span className="flex gap-3 text-[9px] font-semibold text-ink-600">
            <span>Settings</span>
            <span>Help</span>
            <span>Hide</span>
          </span>
        </div>
        <div className="border-b border-[#e0e0e0] bg-[#f2f2f2] px-3 py-1.5 text-[9.5px]">
          <strong>Part 2</strong> · Read the text and answer questions 14–26.
        </div>
        <div className="grid h-[15.5rem] grid-cols-[1fr_12px_1fr]">
          <div className="space-y-3 overflow-hidden p-3.5">
            <p className="text-[12.5px] font-bold text-ink-950">Losing the Dark</p>
            <div className="rounded-[3px] border-2 border-[#8a8a8a] px-1.5 py-0.5 text-[8.5px] font-semibold text-ink-900">v Where light pollution comes from</div>
            <div className="space-y-[7px]">
              <Line w="96%" />
              <Line w="88%" />
              <span className="flex gap-1">
                <Line w="34%" />
                <Line w="46%" mark />
              </span>
              <Line w="91%" />
              <Line w="72%" />
            </div>
            <div className="rounded-[3px] border-2 border-dashed border-[#1d4ed8] px-1.5 py-1 text-[8.5px] font-bold text-[#1d4ed8]">15</div>
            <div className="space-y-[7px]">
              <Line w="93%" />
              <span className="flex gap-1">
                <Line w="52%" mark />
                <Line w="30%" />
              </span>
              <Line w="80%" />
            </div>
          </div>
          <div className="border-x border-[#e0e0e0] bg-[#f2f2f2]" />
          <div className="space-y-2.5 overflow-hidden p-3.5 text-[9.5px] text-ink-900">
            <p className="text-[10.5px] font-bold">Questions 14–20</p>
            <p className="text-ink-600">Choose the correct heading for each paragraph.</p>
            {['i  A problem that can be solved quickly', 'ii  How light affects human health', 'iv  An unexpected result', 'vi  The threat to wildlife'].map((h, i) => (
              <div key={h} className={`rounded-[3px] border px-2 py-1 ${i === 2 ? 'border-[#1d4ed8] bg-[#eef2ff] shadow-md' : 'border-[#c9c9c9]'}`}>
                {h}
              </div>
            ))}
            <p className="pt-1 text-[10.5px] font-bold">Questions 21–22</p>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#1d4ed8]" />A Young turtles move away from the sea
            </div>
          </div>
        </div>
        <div className="flex h-11 items-center justify-between border-t border-[#c9c9c9] bg-[#f2f2f2] px-2">
          <div className="flex items-center gap-1 text-[9px]">
            <span className="mr-1 font-bold text-ink-600">Part 1 13/13</span>
            <span className="flex items-center gap-[3px] rounded-[3px] bg-white px-1.5 py-1 ring-1 ring-[#d0d0d0]">
              <b className="mr-1">Part 2</b>
              {[14, 15, 16, 17, 18, 19, 20, 21].map((n) => (
                <span
                  key={n}
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-[2px] text-[8px] font-bold ${
                    n < 17 ? 'bg-ink-900 text-white' : n === 17 ? 'border-2 border-[#1d4ed8]' : n === 19 ? 'rounded-full border border-[#8a8a8a]' : 'border border-[#8a8a8a]'
                  }`}
                >
                  {n}
                </span>
              ))}
            </span>
          </div>
          <span className="rounded-[3px] bg-[#1d4ed8] px-2 py-1 text-[9px] font-bold text-white">✓ Submit</span>
        </div>
      </div>
      <div className="absolute -top-9 right-4 rotate-2 rounded-xl border-2 border-[#d97706] bg-white px-3 py-1.5 text-xs font-bold text-ink-950 shadow-lg sm:right-10">10 minutes remaining</div>
      <div className="absolute -bottom-5 -left-3 -rotate-2 rounded-2xl bg-ink-950 px-4 py-3 text-paper shadow-xl sm:-left-8">
        <p className="text-[10px] tracking-widest text-paper/60 uppercase">Reading</p>
        <p className="text-2xl leading-none font-semibold text-mark">7.5</p>
        <p className="text-[10px] text-paper/60">33 / 40 correct</p>
      </div>
    </div>
  )
}
