/**
 * Condensed, plain-English summaries of the public IELTS band descriptors,
 * used for self-assessment. Bands 9 → 4, highest first.
 */
export type Descriptor = [band: number, text: string]

export const WRITING_DESCRIPTORS: Record<string, Descriptor[]> = {
  ta: [
    [9, 'Fully meets every requirement. A clear, well-developed overview; key features chosen and illustrated with skill.'],
    [8, 'Covers all requirements well. A clear overview; key features presented clearly with only rare lapses.'],
    [7, 'Covers the requirements. A clear overview of the main trends; key features highlighted, though some could be developed more.'],
    [6, 'Addresses the requirements. An overview is attempted; key features covered, but some detail is missing, inaccurate or irrelevant.'],
    [5, 'Mechanical description with no clear overview; lists details with little comparison; may be under length.'],
    [4, 'Misses or confuses key features; parts are irrelevant or the answer is well under length.'],
  ],
  tr: [
    [9, 'Fully addresses every part of the question. A fully developed position with extended, well-supported ideas.'],
    [8, 'Addresses all parts well. A well-developed response with relevant, extended and supported ideas.'],
    [7, 'Addresses all parts. A clear position throughout; main ideas extended and supported, though some may lose focus.'],
    [6, 'Addresses all parts, some more fully than others. A relevant position, but some ideas are not developed enough.'],
    [5, 'Addresses the task only partly. The position is not always clear and ideas are limited or repeated.'],
    [4, 'Responds minimally or goes off topic. The position is unclear and ideas are few or unsupported.'],
  ],
  cc: [
    [9, 'Organisation and linking are so smooth they go unnoticed. Paragraphing is expertly managed.'],
    [8, 'Ideas are sequenced logically; linking is well managed; paragraphs are used sufficiently and appropriately.'],
    [7, 'Clear progression throughout. A range of linking words, with some over- or under-use; each paragraph has a clear topic.'],
    [6, 'Coherent overall, but linking words are sometimes faulty or mechanical; paragraphing is not always logical.'],
    [5, 'Some organisation but little progression; linking is limited, inaccurate or overused; paragraphs may be missing.'],
    [4, 'Ideas are not arranged coherently; only basic, repetitive linking words.'],
  ],
  lr: [
    [9, 'A wide range of vocabulary used naturally and precisely; only rare slips.'],
    [8, 'Wide, precise vocabulary including less common words, with only occasional errors in word choice or spelling.'],
    [7, 'Enough range for some flexibility and precision; some less common words and good collocations; occasional errors.'],
    [6, 'Adequate range for the task; tries less common words with some inaccuracy; errors do not block meaning.'],
    [5, 'Limited, repetitive vocabulary; noticeable spelling and word-formation errors that cause the reader some difficulty.'],
    [4, 'Basic vocabulary used repetitively; errors in spelling and word formation strain the reader.'],
  ],
  gra: [
    [9, 'A wide range of structures used flexibly and accurately; only rare slips.'],
    [8, 'A wide range of structures; most sentences are error-free.'],
    [7, 'A variety of complex structures and frequent error-free sentences; good control with a few errors.'],
    [6, 'A mix of simple and complex sentences; some grammar and punctuation errors that rarely reduce clarity.'],
    [5, 'A limited range; complex sentences are attempted but often contain errors that cause some difficulty.'],
    [4, 'A very limited range; errors dominate and punctuation is often faulty.'],
  ],
}

export const SPEAKING_DESCRIPTORS: Record<string, Descriptor[]> = {
  fc: [
    [9, 'Speaks fluently with only rare, content-related hesitation; ideas fully developed and linked.'],
    [8, 'Fluent, with only occasional repetition or self-correction; develops topics coherently.'],
    [7, 'Speaks at length without noticeable effort; some hesitation or repetition; uses a range of linking words flexibly.'],
    [6, 'Willing to speak at length, but loses coherence at times through hesitation, repetition or self-correction.'],
    [5, 'Keeps going, but relies on repetition, self-correction or slow speech; simple ideas are fluent, complex ones are not.'],
    [4, 'Cannot answer without noticeable pauses; slow speech with frequent repetition and only simple linking.'],
  ],
  lr: [
    [9, 'Uses vocabulary with full flexibility and precision on every topic, including idiomatic language.'],
    [8, 'A wide vocabulary used readily and precisely, including less common and idiomatic words; paraphrases well.'],
    [7, 'Uses vocabulary flexibly across topics, with some less common and idiomatic items; paraphrases effectively.'],
    [6, 'Enough vocabulary to discuss topics at length and make meaning clear, despite some inappropriate choices.'],
    [5, 'Manages familiar and unfamiliar topics with limited flexibility; paraphrasing is only partly successful.'],
    [4, 'Conveys only basic meaning on unfamiliar topics; frequent errors in word choice; rarely paraphrases.'],
  ],
  gra: [
    [9, 'A full range of structures used naturally; consistently accurate apart from slips.'],
    [8, 'A wide range of structures used flexibly; most sentences are error-free.'],
    [7, 'A range of complex structures with some flexibility; frequent error-free sentences, though some mistakes remain.'],
    [6, 'A mix of simple and complex structures with limited flexibility; mistakes in complex forms rarely block meaning.'],
    [5, 'Basic sentences are reasonably accurate; complex structures are limited and usually contain errors.'],
    [4, 'Mostly basic sentences; subordinate clauses are rare and errors are frequent.'],
  ],
  p: [
    [9, 'A full range of pronunciation features used precisely; effortless to understand.'],
    [8, 'A wide range of features with only occasional lapses; easy to understand throughout.'],
    [7, 'Generally clear, with good control of stress and intonation, though not yet consistent.'],
    [6, 'Generally understood, but some mispronounced words or sounds reduce clarity at times.'],
    [5, 'Understood with some effort; control of stress, rhythm and sounds is limited.'],
    [4, 'Limited control of pronunciation; frequent mispronunciations cause difficulty for the listener.'],
  ],
}
