export interface ClinicLocation {
  name: string
  address: string
  phone: string
  hours: string
  types: string[]
  free: boolean
  lat: number
  lng: number
}

export const clinicLocations: ClinicLocation[] = [
  { name: "Cass Clinic", address: "2727 Second Ave, Detroit, MI 48201", phone: "(313) 833-8500", hours: "Mon–Fri 9am–5pm", types: ["Flu", "COVID", "MMR", "Hepatitis"], free: true, lat: 42.3503, lng: -83.0601 },
  { name: "UM Health — South Main", address: "4260 Plymouth Rd, Ann Arbor, MI 48105", phone: "(734) 936-4000", hours: "Mon–Sat 8am–6pm", types: ["All vaccines", "Travel vaccines"], free: false, lat: 42.3183, lng: -83.7546 },
  { name: "Meijer Pharmacy — Washtenaw", address: "3145 Ann Arbor-Saline Rd, Ann Arbor", phone: "(734) 677-2300", hours: "Daily 9am–9pm", types: ["Flu", "COVID", "Tdap", "Shingles"], free: false, lat: 42.2553, lng: -83.7354 },
  { name: "Ypsilanti Community Health Center", address: "931 W Cross St, Ypsilanti, MI 48197", phone: "(734) 484-3100", hours: "Mon–Fri 8am–5pm", types: ["All childhood vaccines", "Flu", "COVID"], free: true, lat: 42.2417, lng: -83.6309 },
  { name: "CVS MinuteClinic — Ann Arbor", address: "2723 Carpenter Rd, Ann Arbor, MI 48108", phone: "(734) 677-5170", hours: "Daily 8:30am–7:30pm", types: ["Flu", "COVID", "Pneumonia", "Meningitis"], free: false, lat: 42.2393, lng: -83.7069 },
  { name: "Jackson County Health Dept.", address: "3030 Horton Rd, Jackson, MI 49203", phone: "(517) 788-4420", hours: "Mon–Thu 8am–4:30pm", types: ["All vaccines", "VFC program"], free: true, lat: 42.2383, lng: -84.4074 },
]
