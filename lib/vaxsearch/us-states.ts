/**
 * State name (as Nominatim returns it) -> largest city in that state, used to
 * redirect a bare-state search ("VA", "Virginia") to somewhere actually
 * searchable instead of the state's geometric centroid, which is often empty
 * farmland (see geocode.ts). "Largest city" rather than "capital": it is a
 * better proxy for "somewhere with providers nearby" (e.g. Virginia Beach,
 * not Richmond; Anchorage, not Juneau).
 *
 * Approximate by design -- this only needs to land the search radius near
 * real provider density, not be authoritative about city population.
 */
export const STATE_LARGEST_CITY: Record<string, string> = {
  Alabama: "Birmingham, Alabama",
  Alaska: "Anchorage, Alaska",
  Arizona: "Phoenix, Arizona",
  Arkansas: "Little Rock, Arkansas",
  California: "Los Angeles, California",
  Colorado: "Denver, Colorado",
  Connecticut: "Bridgeport, Connecticut",
  Delaware: "Wilmington, Delaware",
  "District of Columbia": "Washington, District of Columbia",
  Florida: "Jacksonville, Florida",
  Georgia: "Atlanta, Georgia",
  Hawaii: "Honolulu, Hawaii",
  Idaho: "Boise, Idaho",
  Illinois: "Chicago, Illinois",
  Indiana: "Indianapolis, Indiana",
  Iowa: "Des Moines, Iowa",
  Kansas: "Wichita, Kansas",
  Kentucky: "Louisville, Kentucky",
  Louisiana: "New Orleans, Louisiana",
  Maine: "Portland, Maine",
  Maryland: "Baltimore, Maryland",
  Massachusetts: "Boston, Massachusetts",
  Michigan: "Detroit, Michigan",
  Minnesota: "Minneapolis, Minnesota",
  Mississippi: "Jackson, Mississippi",
  Missouri: "Kansas City, Missouri",
  Montana: "Billings, Montana",
  Nebraska: "Omaha, Nebraska",
  Nevada: "Las Vegas, Nevada",
  "New Hampshire": "Manchester, New Hampshire",
  "New Jersey": "Newark, New Jersey",
  "New Mexico": "Albuquerque, New Mexico",
  "New York": "New York City, New York",
  "North Carolina": "Charlotte, North Carolina",
  "North Dakota": "Fargo, North Dakota",
  Ohio: "Columbus, Ohio",
  Oklahoma: "Oklahoma City, Oklahoma",
  Oregon: "Portland, Oregon",
  Pennsylvania: "Philadelphia, Pennsylvania",
  "Rhode Island": "Providence, Rhode Island",
  "South Carolina": "Charleston, South Carolina",
  "South Dakota": "Sioux Falls, South Dakota",
  Tennessee: "Nashville, Tennessee",
  Texas: "Houston, Texas",
  Utah: "Salt Lake City, Utah",
  Vermont: "Burlington, Vermont",
  Virginia: "Virginia Beach, Virginia",
  Washington: "Seattle, Washington",
  "West Virginia": "Charleston, West Virginia",
  Wisconsin: "Milwaukee, Wisconsin",
  Wyoming: "Cheyenne, Wyoming",
}
