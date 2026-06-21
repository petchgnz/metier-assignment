const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
]

export function formatThaiDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  const day = d.getDate()
  const month = THAI_MONTHS[d.getMonth()]
  const year = d.getFullYear() + 543
  return `${day} ${month} ${year}`
}

export function formatThaiDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  const time = d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
  return `${formatThaiDate(iso)} ${time} น.`
}

export function formatViews(n: number): string {
  return n.toLocaleString("th-TH")
}
